import {
  onSnapshot,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  Timestamp,
  query,
  where,
} from 'firebase/firestore'
import type {
  Company,
  Permissions,
  Notifications,
  // CompanyNotifications, // uncomment if you have this type
} from '../../shared/types/company'
import { permissionTypes, notificationTypes } from '../../shared/constants'

export const useCompanyStore = defineStore('company', () => {
  // ---------------------------------------------------------------------------
  // Nuxt / Firebase
  // ---------------------------------------------------------------------------
  const nuxtApp = useNuxtApp()
  const { $db, $auth } = nuxtApp

  const companiesRef = collection($db, 'companies')
  // Query where authorizedUsers array contains current user email
  const companiesQuery = query(
    companiesRef,
    where('authorizedUsers', 'array-contains', $auth.currentUser?.email)
  )

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const companies = ref<Company[]>([])

  const company = ref<Company>({
    partnerCode: '',
    partnerId: '',
    companyId: '',
    company: '',
    dba: false,
    dbaName: '',
    dbaUrl: '',
    website: '',
    agent: null,
    agentId: null,
    associates: [],
    registeredAddress: '',
    hasOperationsAddress: false,
    operationsAddress: '',
    contacts: [],
    businessLicense: {
      number: '',
      expiry: '',
      url: '',
    },
    isManufacturer: false,
    manufacturingLicense: {
      number: '',
      expiry: '',
      url: '',
    },
    goodManufacturingLicenseURL: '',
    isChamberMember: false,
    chamberMembership: {
      number: '',
      expiry: '',
    },
    authorizedUsers: [],
    userSettings: {},
    status: 'pending',
    events: {},
  })


  const activeCompanyId = ref<string | null>(null)

  // control validity of address components
  const registeredAdressIsValid = ref<boolean>(true)
  const operationsAdressIsValid = ref<boolean>(true)

  const partnerStore = usePartnerStore()

  // ---------------------------------------------------------------------------
  // Firestore subscription
  // ---------------------------------------------------------------------------
  onSnapshot(companiesQuery, snapshot => {
    snapshot.docChanges().forEach(change => {
      const data = change.doc.data() as Company

      if (change.type === 'added') {
        // avoid duplicates in case of hot-reload / reconnect
        const exists = companies.value.some(
          c => c.companyId === data.companyId || c.companyId === change.doc.id
        )
        if (!exists) {
          companies.value.push(data)
        }
      }

      if (change.type === 'modified') {
        const index = companies.value.findIndex(
          c => c.companyId === change.doc.id || c.companyId === data.companyId
        )
        if (index !== -1) {
          companies.value[index] = data
        }
      }

      if (change.type === 'removed') {
        companies.value = companies.value.filter(
          c => c.companyId !== change.doc.id
        )
      }
    })

    console.log('Company store: Loaded', companies.value.length, 'companies')

    // Only set default if no active company is set yet
    if (!activeCompanyId.value) {
      setActiveCompany()
    }
  })

  // ---------------------------------------------------------------------------
  // Computed
  // ---------------------------------------------------------------------------
  const partner = computed(() => {
    if (!company.value.partnerId) return undefined
    // adjust depending on shape of partners in your store (Map vs Array)
    return Array.from(partnerStore.partners.values()).find(
      p => p.id === company.value.partnerId
    )
  })

  const activeCompany = computed<Company | null>(() => {
    return companies.value.find(c => c.companyId === activeCompanyId.value) || null
  })

  const activeCompanyPartner = computed(() => {
    if (!activeCompany.value?.partnerId) return null
    return Array.from(partnerStore.partners.values()).find(
      p => p.id === activeCompany.value?.partnerId
    ) || null
  })

  const notifications = computed(() => {
    const notifications: Record<string, string[]> = {} // CompanyNotifications if you have the type

    if (activeCompany.value === null) return notifications

    const users = Object.keys(activeCompany.value.userSettings || {})
    users.forEach(u => {
      activeCompany.value?.userSettings[u]?.notifications.forEach(n => {
        if (!notifications[n]) {
          notifications[n] = []
        }
        notifications[n].push(u)
      })
    })

    return notifications
  })

  type CompanyList = {
    companyId: string
    company: string
    partner: string
    partnerLogo: string
    isDefault: boolean
    isArchived: boolean
    status: 'approved' | 'pending' | 'rejected'
  }[]

  const companyList: ComputedRef<CompanyList> = computed(() => {
    return companies.value.map(c => ({
      companyId: c.companyId,
      company: c.company,
      partner: partnerStore.partnerMap.get(c.partnerCode)?.name?.en || '',
      partnerLogo: partnerStore.partnerMap.get(c.partnerCode)?.logo || '',
      isDefault: c?.isDefault || false,
      isArchived: c?.isArchived || false,
      status: c.status,
    }))
  })

  // ---------------------------------------------------------------------------
  // Helpers / Getters-like functions
  // ---------------------------------------------------------------------------
  function getCompanyById(companyId: string) {
    const _company = companies.value.find(c => c.companyId === companyId)
    if (_company) {
      company.value = { ..._company }
      return true
    }
    return false
  }


  let addressesUnsub: (() => void) | null = null

  // 1️⃣ Map first
  const addressMap = ref<Map<string, Address>>(new Map<string, Address>())

  // 2️⃣ Then computed array for UI
  const addressList = computed(() => Array.from(addressMap.value.values()))

  // 3️⃣ Filtered computed arrays
  const buyers = computed(() =>
    Array.from(addressMap.value.values()).filter(a => a.type === 'buyer')
  )

  // 4️⃣ Filtered computed arrays
  const consignees = computed(() =>
    Array.from(addressMap.value.values()).filter(a => a.type === 'consignee')
  )



  async function setActiveCompany(companyId?: string) {
    if (companyId) {
      activeCompanyId.value = companyId

      if (process.client) {
        localStorage.setItem('activeCompanyId', companyId)
      }

      // 🛑 Stop previous listener if switching companies
      if (addressesUnsub) {
        addressesUnsub()
        addressesUnsub = null
      }

      // clear current map
      addressMap.value = new Map<string, Address>()
      const addressesRef = collection($db, 'companies', companyId, 'addresses')

      // -------------------------------------------------------------------
      // 1️⃣ INITIAL LOAD WITH getDocs
      // -------------------------------------------------------------------
      const q = query(addressesRef, where("isDeleted", "==", false))

      const snap = await getDocs(q)
      console.log('Loading addresses for company:', companyId, snap.size, 'addresses');

      const map = new Map<string, Address>()
      snap.docs.forEach(d => {
        const data = d.data() as Address
        console.log('Loaded address:', d.id, data);

        // 🔑 pick ONE id source and be consistent:
        // if you want Firestore doc.id as key:
        map.set(d.id, { ...data }) // or { ...data, addressId: d.id } if needed
        // if you *must* use data.addressId, then also use it in onSnapshot below
      })

      addressMap.value = map

      // -------------------------------------------------------------------
      // 2️⃣ REALTIME UPDATES WITH CHANGE TYPES
      // -------------------------------------------------------------------
      addressesUnsub = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const id = change.doc.id
          const data = change.doc.data() as Address

          switch (change.type) {
            case 'added':
            case 'modified':
              addressMap.value.set(id, data)
              break

            case 'removed':
              addressMap.value.delete(id)
              break
          }
        })

        // 🔥 IMPORTANT: reassign Map so Vue recomputes addressList
        addressMap.value = new Map(addressMap.value)
      })

      return
    }

    // -------------------------------------------------------------------
    // RESTORE DEFAULT / SAVED COMPANY (unchanged logic)
    // -------------------------------------------------------------------
    let savedCompanyId: string | null = null

    if (process.client) {
      savedCompanyId = localStorage.getItem('activeCompanyId')
    }

    if (savedCompanyId && companies.value.some(c => c.companyId === savedCompanyId)) {
      activeCompanyId.value = savedCompanyId
      return
    }

    const def = companies.value.find(c => c?.isDefault)
    if (def) {
      activeCompanyId.value = def.companyId
    }

    if (!activeCompanyId.value) {
      activeCompanyId.value = companies.value[0]?.companyId || null
    }

    if (process.client && activeCompanyId.value) {
      localStorage.setItem('activeCompanyId', activeCompanyId.value)
    }
  }



  function newCompany() {
    company.value = {
      partnerCode: '',
      partnerId: '',
      companyId: crypto.randomUUID(),
      company: '',
      dba: false,
      dbaName: '',
      dbaUrl: '',
      website: '',
      agent: null,
      agentId: null,
      associates: [],
      registeredAddress: '',
      hasOperationsAddress: false,
      operationsAddress: '',
      contacts: [],
      businessLicense: {
        number: '',
        expiry: '',
        url: '',
      },
      isManufacturer: false,
      manufacturingLicense: {
        number: '',
        expiry: '',
        url: '',
      },
      goodManufacturingLicenseURL: '',
      isChamberMember: false,
      chamberMembership: {
        number: '',
        expiry: '',
      },
      authorizedUsers: [],
      userSettings: {},
      status: 'pending',
      events: {},
    }
  }

  // ---------------------------------------------------------------------------
  // Actions: Firestore writes
  // ---------------------------------------------------------------------------
  function setCompany() {
    const { $auth, $db } = useNuxtApp()
    const companyRef = doc($db, 'companies', company.value.companyId)

    // first time creation
    if (!company.value.events?.created) {
      company.value.events = {
        created: {
          by: $auth.currentUser?.email!,
          date: Timestamp.now(),
        },
      }

      // first time submission, set authorized users and user settings
      company.value.authorizedUsers = [$auth.currentUser?.email!]
      company.value.userSettings = {
        [$auth.currentUser?.email!]: {
          permissions: permissionTypes.map(p => p as Permissions),
          notifications: notificationTypes.map(n => n as Notifications),
          created: {
            by: $auth.currentUser?.email!,
            date: Timestamp.now(),
          },
          lastUpdate: {
            by: $auth.currentUser?.email!,
            date: Timestamp.now(),
          },
        },
      }
    }

    if (company.value.events.submitted === undefined) {
      company.value.events.submitted = []
    }
    company.value.events.submitted.push({
      by: $auth.currentUser?.email!,
      date: Timestamp.now(),
    })

    if (company.value.events.lastUpdated === undefined) {
      company.value.events.lastUpdated = []
    }
    company.value.events.lastUpdated.push({
      by: $auth.currentUser?.email!,
      date: Timestamp.now(),
    })

    return setDoc(companyRef, company.value)
  }

  async function toggleDefault(companyId: string) {
    if (!companyId) return
    const { $db } = useNuxtApp()

    // Run updates sequentially; could also batch if you want
    for (const c of companyList.value) {
      const ref = doc($db, 'companies', c.companyId)

      if (c.companyId === companyId) {
        await updateDoc(ref, { isDefault: true })
      } else if (c.isDefault) {
        await updateDoc(ref, { isDefault: false })
      }
    }
  }

  async function toggleArchive(companyId: string) {
    if (!companyId) return
    const { $db } = useNuxtApp()
    const ref = doc($db, 'companies', companyId)
    const snap = await getDoc(ref)

    if (snap.exists()) {
      const current = snap.data().isArchived || false
      await updateDoc(ref, { isArchived: !current })
    }
  }

  function setUserSettings(
    user: string,
    settings: { permissions: Permissions[]; notifications: Notifications[] }
  ) {
    const { $auth } = useNuxtApp()

    // deep clone to trigger reactivity
    company.value = JSON.parse(JSON.stringify(activeCompany.value))

    if (!company.value.authorizedUsers.includes(user)) {
      company.value.authorizedUsers.push(user)
      company.value.userSettings[user] = {
        permissions: settings.permissions,
        notifications: settings.notifications,
        created: {
          by: $auth.currentUser?.email!,
          date: Timestamp.now(),
        },
        lastUpdate: {
          by: $auth.currentUser?.email!,
          date: Timestamp.now(),
        },
      }
    } else {
      company.value.userSettings[user]!.permissions = settings.permissions
      company.value.userSettings[user]!.notifications = settings.notifications
      company.value.userSettings[user]!.lastUpdate = {
        by: $auth.currentUser?.email!,
        date: Timestamp.now(),
      }
    }

    setCompany()
  }

  function removeUser(user: string) {
    // deep clone to trigger reactivity
    company.value = JSON.parse(JSON.stringify(activeCompany.value))

    company.value.authorizedUsers = company.value.authorizedUsers.filter(
      u => u !== user
    )
    delete company.value.userSettings[user]

    if (
      confirm(
        `Are you sure you want to remove ${user} from this company? This action cannot be undone.`
      )
    ) {
      setCompany()
    }

    // If you want to remove without confirmation, use:
    // companyStore.removeUser(user);
  }

  function setAddress(address: Address) {
    if (!activeCompanyId.value) {
      throw new Error('No active company selected')
    }
    console.log('Setting address:', activeCompanyId.value, address);

    const addressRef = doc(
      $db,
      'companies',
      activeCompanyId.value,
      'addresses',
      address.addressId
    )
    return setDoc(addressRef, address)
  }

  function deleteAddress(addressId: string) {
    if (!activeCompanyId.value) {
      throw new Error('No active company selected')
    }

    const addressRef = doc(
      $db,
      'companies',
      activeCompanyId.value,
      'addresses',
      addressId
    )
    return updateDoc(addressRef, { isDeleted: true })
  }


  // ---------------------------------------------------------------------------
  // Watchers
  // ---------------------------------------------------------------------------
  watch(
    () => activeCompanyId.value,
    newVal => {
      // navigateTo(`/company/dashboard`) // if/when you want route reaction
    },
    { immediate: true }
  )

  // ---------------------------------------------------------------------------
  // Exposed API
  // ---------------------------------------------------------------------------
  return {
    // state
    companies,
    company,
    activeCompanyId,
    registeredAdressIsValid,
    operationsAdressIsValid,
    addressMap,

    // computed
    partner,
    activeCompany,
    activeCompanyPartner,
    companyList,
    notifications,
    addressList,
    buyers,
    consignees,

    // methods
    getCompanyById,
    newCompany,
    setCompany,
    toggleDefault,
    toggleArchive,
    setUserSettings,
    removeUser,
    setActiveCompany,
    setAddress,
    deleteAddress,
  }
})

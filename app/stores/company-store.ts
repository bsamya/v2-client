import { onSnapshot, collection, doc, setDoc, getDoc, updateDoc, Timestamp, query, where } from 'firebase/firestore';
import type { Company, Permissions, Notifications } from '../../shared/types/company'
import { permissionTypes, notificationTypes } from '../../shared/constants'


export const useCompanyStore = defineStore('company', () => {

  const companies = ref<Company[]>([]);
  const company = ref<Company>({
    partnerCode: "",
    partnerId: "",
    companyId: "",
    company: "",
    dba: false,
    dbaName: "",
    dbaUrl: "",
    website: "",
    agent: null,
    agentId: null,
    associates: [],
    registeredAddress: "",
    hasOperationsAddress: false,
    operationsAddress: "",
    contacts: [],
    businessLicense: {
      number: "",
      expiry: "",
      url: "",
    },
    isManufacturer: false,
    manufacturingLicense: {
      number: "",
      expiry: "",
      url: "",
    },
    goodManufacturingLicenseURL: "",
    isChamberMember: false,
    chamberMembership: {
      number: "",
      expiry: "",
    },

    authorizedUsers: [],
    userSettings: {},
    status: "pending",
    events: {}
  });

  const activeCompanyId = ref<string | null>();

  const partnerStore = usePartnerStore();
  const partner = computed(() => {
    if (!company.value.partnerId) return undefined
    return partnerStore.partners.values().find(p => p.id === company.value.partnerId);
  });

  //control validity of address components
  const registeredAdressIsValid = ref<boolean>(true);
  const operationsAdressIsValid = ref<boolean>(true);

  function getCompanyById(companyId: string) {
    const _company = companies.value.find(c => c.companyId === companyId);
    if (_company) {
      company.value = { ..._company };
      return true
    }
    return false
  }

  // Initialize Firestore listener when nuxt app is available




  const nuxtApp = useNuxtApp();
  const { $db, $auth } = nuxtApp;

  const companiesRef = collection($db, 'companies');
  //query where authorizedUsers array contains current user id
  const q = query(companiesRef, where('authorizedUsers', 'array-contains', $auth.currentUser?.email));

  onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        companies.value.push(change.doc.data() as Company);
      }
      if (change.type === 'modified') {
        const index = companies.value.findIndex((company) => company.companyId === change.doc.id);
        companies.value[index] = change.doc.data() as Company;
      }
      if (change.type === 'removed') {
        companies.value = companies.value.filter((company) => company.companyId !== change.doc.id);
      }
    });

    console.log('Company store: Loaded', companies.value.length, 'companies');

    // Only set default if no active company is set yet
    if (!activeCompanyId.value) {
      setActiveCompany(); // This will now check localStorage first
    }
  });


  const activeCompany = computed(() => {
    return companies.value.find(c => c.companyId === activeCompanyId.value) || null;
  });

  const activeCompanyPartner = computed(() => {
    return partnerStore.partners.values().find(p => p.id === activeCompany.value?.partnerId) || null;
  })

  const notifications = computed(() => {
    const notifications: CompanyNotifications = {}

    if (activeCompany.value === null) return notifications;

    const users = Object.keys(activeCompany.value?.userSettings || [])
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
    partnerLogo: string,
    isDefault: boolean,
    isArchived: boolean,
    status: "approved" | "pending" | "rejected",
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



  function setActiveCompany(companyId?: string) {
    console.log('setActiveCompany called with:', companyId)
    console.log('Current activeCompanyId:', activeCompanyId.value)

    if (companyId) {
      //set selected company
      activeCompanyId.value = companyId;
      // Save to localStorage
      if (process.client) {
        localStorage.setItem('activeCompanyId', companyId);
      }
      console.log('Set activeCompanyId to:', activeCompanyId.value)
    } else {
      // First try to restore from localStorage
      let savedCompanyId: string | null = null;
      if (process.client) {
        savedCompanyId = localStorage.getItem('activeCompanyId');
      }

      // Check if saved company still exists in companies array
      if (savedCompanyId && companies.value.some(c => c.companyId === savedCompanyId)) {
        activeCompanyId.value = savedCompanyId;
        console.log('Restored activeCompanyId from localStorage:', activeCompanyId.value)
        return;
      }

      //set default company if exists
      companies.value.forEach(c => {
        if (c?.isDefault) {
          activeCompanyId.value = c.companyId;
        }
      });

      //else set first company
      if (!activeCompanyId.value) {
        activeCompanyId.value = companies.value[0]?.companyId || null;
      }

      // Save the fallback selection to localStorage
      if (process.client && activeCompanyId.value) {
        localStorage.setItem('activeCompanyId', activeCompanyId.value);
      }

      console.log('Set default activeCompanyId to:', activeCompanyId.value)
    }
  }

  function newCompany() {
    company.value = {
      partnerCode: "",
      partnerId: "",
      companyId: crypto.randomUUID(),
      company: "",
      dba: false,
      dbaName: "",
      dbaUrl: "",
      website: "",
      agent: null,
      agentId: null,
      associates: [],
      registeredAddress: "",
      hasOperationsAddress: false,
      operationsAddress: "",
      contacts: [],
      businessLicense: {
        number: "",
        expiry: "",
        url: "",
      },
      isManufacturer: false,
      manufacturingLicense: {
        number: "",
        expiry: "",
        url: "",
      },
      goodManufacturingLicenseURL: "",
      isChamberMember: false,
      chamberMembership: {
        number: "",
        expiry: "",
      },
      authorizedUsers: [],
      userSettings: {},
      status: "pending",
      events: {}
    }
  }

  function setCompany() {
    const { $auth, $db } = useNuxtApp();
    const companyRef = doc($db, 'companies', company.value.companyId);
    if (!company.value.events?.created) {
      company.value.events = {
        created: {
          by: $auth.currentUser?.email!,
          date: Timestamp.now()
        }
      };

      //first time submission, set authorized users and user settings
      company.value.authorizedUsers = [$auth.currentUser?.email!];
      company.value.userSettings = {
        [$auth.currentUser?.email!]: {
          permissions: permissionTypes.map(p => p as Permissions) as Permissions[],
          notifications: notificationTypes.map(n => n as Notifications) as Notifications[],
          created: {
            by: $auth.currentUser?.email!,
            date: Timestamp.now()
          },
          lastUpdate: {
            by: $auth.currentUser?.email!,
            date: Timestamp.now()
          },
        }
      }
    }

    if (company.value.events.submitted === undefined) {
      company.value.events.submitted = [];
    }
    company.value.events.submitted.push({
      by: $auth.currentUser?.email!,
      date: Timestamp.now()
    });

    if (company.value.events.lastUpdated === undefined) {
      company.value.events.lastUpdated = [];
    }
    company.value.events.lastUpdated.push({
      by: $auth.currentUser?.email!,
      date: Timestamp.now()
    });
    return setDoc(companyRef, company.value);
  }

  async function toggleDefault(companyId: string) {
    if (!companyId) return;
    const { $db } = useNuxtApp();
    companyList.value.forEach(async (c) => {
      //set default company
      if (c.companyId === companyId) {
        updateDoc(doc($db, 'companies', c.companyId), { isDefault: true })
      }
      //remove other default company
      else if (c.isDefault) {

        updateDoc(doc($db, 'companies', c.companyId), { isDefault: false })
      };
    })



  }

  async function toggleArchive(companyId: string) {
    const { $db } = useNuxtApp();
    const ref = doc($db, 'companies', companyId)
    const snap = await getDoc(ref)

    if (snap.exists()) {
      const current = snap.data().isArchived || false
      await updateDoc(ref, { isArchived: !current })
    }
  }

  function setUserSettings(user: string, settings: { permissions: Permissions[], notifications: Notifications[] }) {
    const { $auth } = useNuxtApp();
    company.value = JSON.parse(JSON.stringify(activeCompany.value)); //deep clone to trigger reactivity
    if (!company.value.authorizedUsers.includes(user)) {
      company.value.authorizedUsers.push(user);
      company.value.userSettings[user] = {
        permissions: settings.permissions,
        notifications: settings.notifications,
        created: {
          by: $auth.currentUser?.email!,
          date: Timestamp.now()
        },
        lastUpdate: {
          by: $auth.currentUser?.email!,
          date: Timestamp.now()
        },
      }
    } else {
      company.value.userSettings[user]!.permissions = settings.permissions
      company.value.userSettings[user]!.notifications = settings.notifications
      company.value.userSettings[user]!.lastUpdate = {
        by: $auth.currentUser?.email!,
        date: Timestamp.now()
      };
    }
    setCompany()
  }

  function removeUser(user: string) {
    company.value = JSON.parse(JSON.stringify(activeCompany.value)); //deep clone to trigger reactivity
    company.value.authorizedUsers = company.value.authorizedUsers.filter(u => u !== user);
    delete company.value.userSettings[user];
    if (confirm(`Are you sure you want to remove ${user} from this company? This action cannot be undone.`)) {
      setCompany()
    }


    //uncomment to remove without confirmation
    //  companyStore.removeUser(user);  
    setCompany()
  }


  watch(() => activeCompanyId.value, (newVal) => {
    //navigateTo(`/company/dashboard`)

  }, { immediate: true });


  return {
    companies,
    company,
    partner,
    registeredAdressIsValid,
    operationsAdressIsValid,
    activeCompanyId,
    activeCompany,
    activeCompanyPartner,
    getCompanyById,
    newCompany,
    setCompany,
    toggleDefault,
    toggleArchive,
    setUserSettings,
    removeUser,
    setActiveCompany,
    companyList,
    notifications,
  };
})

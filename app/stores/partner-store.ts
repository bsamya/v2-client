import { onSnapshot, collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { certificates } from '../../shared/settings'


export const usePartnerStore = defineStore('partner', () => {

  const partners = ref<Partner[]>([]);



  const nuxtApp = useNuxtApp();
  const { $db } = nuxtApp;

  onSnapshot(collection($db, 'partners'), (snapshot) => {
    partners.value = snapshot.docs.map(doc => {
      return { ...doc.data() as Partner };
    });
    console.log('Partner store: Loaded', partners.value.length, 'partners');
  });

  //==========================
  const partner = ref<Partner>({
    id: crypto.randomUUID(),
    code: "",
    name: {
      en: "",
    },
    address: {
      en: "",
    },
    web: "",
    email: "",
    phone: "",
    logo: "",
    isActive: false,
    isManagedAccount: false,
    contacts: [],
    creditCardFees: 0,
    //@ts-ignore
    certificates: { ...certificates },
    associates: [],
  });

  const partnerMap = computed(() => {
    const map = new Map<string, Partner>();
    partners.value.forEach(partner => {
      map.set(partner.code, partner);
    });
    return map;
  });



  function get(partnerId: string) {
    const partnerData = partners.value.find(p => p.id === partnerId);
    if (!partnerData) {
      console.error("Partner not found:", partnerId);
      return false;
    }
    partner.value = { ...partnerData };
    return true
  }


  return { partners, partner, partnerMap, get };
})
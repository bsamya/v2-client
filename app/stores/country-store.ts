import { onSnapshot, collection, doc } from 'firebase/firestore';

export const useCountryStore = defineStore('country', () => {
  const data = ref<{
    authenticationType: 'Apostille' | 'Legalization';
    value: string;
    title: string;
    embassy?: {
      fees: number;
      processingTime: number;
      serviceFees: number;
    };
  }[]>([]);
  
  const authenticationParams = ref<CountrySettings | null>(null);

  const nuxtApp = useNuxtApp();
  const { $db } = nuxtApp;

  onSnapshot(collection($db, 'countries'), (snapshot) => {
    data.value = snapshot.docs.map(doc => {
      const data = doc.data() as Country;
      return {
        authenticationType: data.authenticationType,
        value: data.countryCode,
        title: data.name.en ?? '',
        ...(data.authenticationType === "Legalization" && { embassy: data.embassy })
      };
    }) ?? [];

    console.log('Country store: Loaded', data.value.length, 'countries');
  });

  const configRef = doc($db, 'configuration', 'authenticationParams');
  onSnapshot(configRef, (snapshot) => {
    if (snapshot.exists() === false) return null;
    authenticationParams.value = snapshot.data() as CountrySettings;
  });

  const dataMap = computed(() => {
    const map = new Map<string, {
      authenticationType: 'Apostille' | 'Legalization';
      value: string;
      title: string;
      embassy?: {
        fees: number;
        processingTime: number;
        serviceFees: number;
      };
    }>();
    data.value.forEach(item => {
      map.set(item.value, item);
    });
    return map;
  });

  return {
    data,
    dataMap,
    authenticationParams,
  };
})
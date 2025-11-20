import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth, setPersistence, onAuthStateChanged, browserLocalPersistence, type User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// plugins/firebase.client.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();
  const firebase = config.public.firebase as FirebaseOptions;

  // Validate config presence to avoid app/no-options
  if (!firebase || !firebase.apiKey) {
    console.error('Firebase client config is missing. Please set runtimeConfig.public.firebase in nuxt.config.ts');
    return;
  }

  // Initialize Firebase
  const app = initializeApp(firebase)

  const auth = getAuth(app)
  const db = getFirestore(app);
  const storage = getStorage(app);

  const user = useState('user', (): User | null => null)


  setPersistence(auth, browserLocalPersistence)
    .catch((error) => console.error("Error setting persistence:", error));

  await new Promise<void>((resolve) => {
    onAuthStateChanged(auth, (thisUser) => {
      user.value = thisUser;
      resolve()
    });
  });



  // Provide the auth instance and user to the Nuxt app
  nuxtApp.provide('auth', auth)
  nuxtApp.provide('db', db)
  nuxtApp.provide('storage', storage)
})
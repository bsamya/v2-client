import { type Firestore } from "firebase/firestore";
import { type Auth } from 'firebase/auth';
import { type FirebaseStorage } from "firebase/storage";

declare module '#app' {
  interface NuxtApp {
    $auth: Auth,
    $db: Firestore,
    $storage: FirebaseStorage,
    $uuid: () => string
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $auth: Auth,
    $db: Firestore,
    $storage: FirebaseStorage
  }
}

// types/index.d.ts
declare global {


}

export { };
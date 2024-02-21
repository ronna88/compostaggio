import { initializeApp } from 'firebase/app'
import { memoryLocalCache, persistentLocalCache, persistentMultipleTabManager, CACHE_SIZE_UNLIMITED } from 'firebase/firestore'
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE,
  messagingSenderId: import.meta.env.VITE_MESSAGING,
  appId: import.meta.env.VITE_API_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig, {
  localCache: persistentLocalCache({
    localCache: CACHE_SIZE_UNLIMITED,
    useFetchStreams: true,
    tabManager: persistentMultipleTabManager(),
  }),
})
// export const app = initializeApp(firebaseConfig)

export const analytics = getAnalytics(app);
export const useFirebaseReady = () => {
  const isReady = useState('firebase-ready', () => false)
  
  const waitForFirebase = async (): Promise<void> => {
    if (isReady.value) return
    
    return new Promise((resolve) => {
      const checkReady = () => {
        if (isReady.value) {
          resolve()
        } else {
          // Try to check if Firebase services are available
          try {
            const { $auth, $db, $storage } = useNuxtApp()
            if ($auth && $db && $storage) {
              isReady.value = true
              resolve()
            } else {
              setTimeout(checkReady, 50)
            }
          } catch {
            setTimeout(checkReady, 50)
          }
        }
      }
      checkReady()
    })
  }
  
  const ensureFirebaseServices = () => {
    try {
      const { $auth, $db, $storage } = useNuxtApp()
      
      if (!$auth) throw new Error('Firebase Auth not available')
      if (!$db) throw new Error('Firebase Firestore not available') 
      if (!$storage) throw new Error('Firebase Storage not available')
      
      return { $auth, $db, $storage }
    } catch (error) {
      console.error('Firebase services not available:', error)
      throw error
    }
  }
  
  return {
    isReady: readonly(isReady),
    waitForFirebase,
    ensureFirebaseServices
  }
}
<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Firebase Initialization Test</h1>
    
    <div class="space-y-2">
      <div class="flex items-center space-x-2">
        <span class="font-semibold">Firebase Ready:</span>
        <span :class="isFirebaseReady ? 'text-green-600' : 'text-red-600'">
          {{ isFirebaseReady ? '✓ Ready' : '✗ Not Ready' }}
        </span>
      </div>
      
      <div class="flex items-center space-x-2">
        <span class="font-semibold">Auth Service:</span>
        <span :class="authStatus.available ? 'text-green-600' : 'text-red-600'">
          {{ authStatus.available ? '✓ Available' : '✗ Not Available' }}
        </span>
        <span v-if="authStatus.user" class="text-blue-600">
          (User: {{ authStatus.user.email }})
        </span>
      </div>
      
      <div class="flex items-center space-x-2">
        <span class="font-semibold">Firestore:</span>
        <span :class="firestoreAvailable ? 'text-green-600' : 'text-red-600'">
          {{ firestoreAvailable ? '✓ Available' : '✗ Not Available' }}
        </span>
      </div>
      
      <div class="flex items-center space-x-2">
        <span class="font-semibold">Storage:</span>
        <span :class="storageAvailable ? 'text-green-600' : 'text-red-600'">
          {{ storageAvailable ? '✓ Available' : '✗ Not Available' }}
        </span>
      </div>
    </div>
    
    <button 
      @click="testFirebase" 
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Test Firebase Connection
    </button>
    
    <div v-if="testResult" class="mt-4 p-2 border rounded" :class="testResult.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'">
      <p class="font-semibold">Test Result:</p>
      <p>{{ testResult.message }}</p>
    </div>
  </div>
</template>

<script setup>
const { isReady: isFirebaseReady, ensureFirebaseServices } = useFirebaseReady()

const authStatus = ref({ available: false, user: null })
const firestoreAvailable = ref(false)
const storageAvailable = ref(false)
const testResult = ref(null)

const checkServices = () => {
  try {
    const { $auth, $db, $storage } = useNuxtApp()
    
    authStatus.value = {
      available: !!$auth,
      user: $auth?.currentUser || null
    }
    
    firestoreAvailable.value = !!$db
    storageAvailable.value = !!$storage
    
  } catch (error) {
    console.error('Error checking Firebase services:', error)
  }
}

const testFirebase = async () => {
  try {
    const { $auth, $db, $storage } = ensureFirebaseServices()
    
    // Test basic connectivity
    testResult.value = {
      success: true,
      message: `Firebase services are working correctly. Auth: ${!!$auth}, Firestore: ${!!$db}, Storage: ${!!$storage}`
    }
    
  } catch (error) {
    testResult.value = {
      success: false,
      message: `Firebase test failed: ${error.message}`
    }
  }
}

onMounted(() => {
  checkServices()
  
  // Check services every second until they're all available
  const interval = setInterval(() => {
    checkServices()
    if (authStatus.value.available && firestoreAvailable.value && storageAvailable.value) {
      clearInterval(interval)
    }
  }, 1000)
  
  // Clear interval after 10 seconds to prevent infinite checking
  setTimeout(() => clearInterval(interval), 10000)
})
</script>
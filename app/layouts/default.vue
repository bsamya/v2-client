<template>
  <v-app>
    <!-- Header -->
    <v-app-bar app
               flat
               dark
               elevation="6">
      <v-img src="/images/swiftdox-logo.svg"
             max-height="60"
             max-width="120"
             contain
             class="mr-2 ml-2" />


      <company-selector />
      <v-spacer />

      <language-switcher class="mr-4" />
      <client-only>
        <v-tooltip v-if="auth.user.value"
                   location="bottom">
          <template #activator="{ props }">
            <v-btn v-bind="props"
                   icon="mdi-logout"
                   @click="signout" />
          </template>
          Signout {{ auth.user.value.email }}
        </v-tooltip>

        <v-tooltip v-else
                   location="bottom">
          <template #activator="{ props }">


            <v-btn v-bind="props"
                   icon="mdi-login"
                   to="/auth/login"> </v-btn>
          </template>
        </v-tooltip>
      </client-only>

    </v-app-bar>

    <!-- Main content -->
    <v-main class="">
      <v-container class="">
        <slot />
      </v-container>
    </v-main>

    <!-- Footer navbar -->
    <v-bottom-navigation :elevation="6"
                         grow>
      <v-spacer></v-spacer>
      <NuxtLink v-for="option in footerOptions"
                :key="option.text"
                :to="option.to">
        <v-btn>
          <v-icon>{{ option.icon }}</v-icon>
          <span class="hidden sm:inline-block">{{ $t(option.text) }}</span>
        </v-btn>
      </NuxtLink>
      <v-spacer></v-spacer>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup lang="ts">

const auth = useAuth()
const signout = async () => {
  auth.logout()
    .then(() => {
      console.log("User signed out", auth.user.value)
      navigateTo('/auth/login')
    })
    .catch((error) => {
      console.error(error)
    })
}

watch(() => auth.user.value, (newUser) => {
  if (newUser) {
    console.clear()
    console.log("User is signed in:", newUser)
  }
})

const route = useRoute()
const companyStore = useCompanyStore()
if (companyStore.companies.length === 0 && route.path.startsWith('/company')) {
  useRouter().push('/companies')
} else if (companyStore.companies.length !== 0 && !companyStore.activeCompanyId) {
  companyStore.setActiveCompany()
}
</script>
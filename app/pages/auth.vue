<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12"
             md="10"
             lg="8">
        <v-card class="m-auto w-full max-w-lg mt-40"
                max-width="750">
          <v-card-title class="text-center justify-center py-2">
            <nuxt-img src="/images/swiftdox-logo.svg"
                      style="max-width: 300px; max-height: 75px; object-fit: cover;"
                      class="m-auto" />
          </v-card-title>

          <v-card-text>
            <auth-reset-password v-if="$route.query.mode === 'resetPassword'" />
            <auth-verify-email v-else-if="$route.query.mode === 'verifyEmail'" />
            <div v-else>

              <v-tabs :model-value="activeTab"
                      grow>
                <v-tab value="login"
                       to="/auth/login">{{ $t('signin') }}</v-tab>
                <v-tab value="register"
                       to="/auth/register">{{$t("register")}}</v-tab>
                <v-tab value="forgot-password"
                       to="/auth/forgot-password">{{$t("forgot-password")}}</v-tab>
              </v-tabs>

              <NuxtPage class="pt-4" />
            </div>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const route = useRoute()
type AuthTab = 'login' | 'register' | 'forgot-password' | null

const activeTab = computed<AuthTab>(() => {
  const path = route.path
  if (path.includes('/register')) {
    return 'register'
  } else if (path.includes('/forgot-password')) {
    return 'forgot-password'
  }
  return 'login'
})

definePageMeta({
  authRequired: false,
})
</script>

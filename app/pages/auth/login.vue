<template>
  <div class="">
    <v-form @submit.prevent="submit">
      <v-text-field v-model="form.email"
                    prepend-inner-icon="mdi-email"
                    :label="$t('input.label.email')"
                    clearable
                    density="compact"
                    :error-messages="v$.email.$errors.map(e => e.$message as string)" />
      <v-text-field v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    :label="$t('input.label.password')"
                    prepend-inner-icon="mdi-lock"
                    clearable
                    density="compact"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    :error-messages="v$.password.$errors.map(e => e.$message as string)"
                    @click:append-inner="
                      showPassword = !showPassword" />

      <v-alert v-if="error"
               class="p-4 my-4"
               type="error"
               prominent
               clearable>{{ error }}</v-alert>


      <v-btn color="primary"
             type="submit"
             :text="$t('signin')" />
    </v-form>
  </div>
</template>

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, maxLength, helpers } from '@vuelidate/validators'
const { t } = useI18n()

const auth = useAuth()
const showPassword = ref(false)
const form = ref({ email: "", password: "" })
const rules = {
  email: {
    required: helpers.withMessage(t('input.error.email.required'), required),
    email: helpers.withMessage(t('input.error.email.invalid'), email),
  },
  password: {
    required: helpers.withMessage(t('input.error.password.required'), required),
    minLength: helpers.withMessage(t('input.error.password.min', { min: 6 }), minLength(6)),
    maxLength: helpers.withMessage(t('input.error.password.max', { max: 20 }), maxLength(20)),
    complex: helpers.withMessage(
      t('input.error.password.complex'),
      (v: string) => /[A-Z]/.test(v) && /[a-z]/.test(v) && /[0-9]/.test(v)
    ),
  },
}

const v$ = useVuelidate(rules, form)
const error = ref<null | string>(null)
async function submit() {
  v$.value.$touch()
  const isValid = await v$.value.$validate()
  console.log(isValid)

  if (!isValid) return

  const response = await auth.login(form.value.email, form.value.password)
  console.log(response)

  if (response.status === 'success') {
    navigateTo('/')
  } else if (response.status === 'error') {
    error.value = response.message
  }
}

</script>
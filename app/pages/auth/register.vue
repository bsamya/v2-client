<template>
  <div class="">
    <v-form @submit.prevent="submit">
      <v-text-field v-model="form.firstName"
                    prepend-inner-icon="mdi-email"
                    :label="$t('input.label.first-name')"
                    clearable
                    density="compact"
                    :error-messages="v$.firstName.$errors.map(e => e.$message as string)" />

      <v-text-field v-model="form.lastName"
                    prepend-inner-icon="mdi-email"
                    :label="$t('input.label.last-name')"
                    clearable
                    density="compact"
                    :error-messages="v$.lastName.$errors.map(e => e.$message as string)" />

      <v-text-field v-model="form.email"
                    prepend-inner-icon="mdi-email"
                    :label="$t('input.label.email', { field: 'Email' })"
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
                    @click:append-inner="showPassword = !showPassword" />

      <v-text-field v-model="form.confirmPassword"
                    :type="showPassword ? 'text' : 'password'"
                    :label="$t('input.label.confirm-password')"
                    prepend-inner-icon="mdi-lock"
                    clearable
                    density="compact"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    :error-messages="v$.confirmPassword.$errors.map(e => e.$message as string)"
                    @click:append-inner="
                      showPassword = !showPassword" />
      <hr class="my-4" />
      <v-btn color="primary"
             variant="elevated"
             type="submit">{{ $t("register") }}</v-btn>

    </v-form>

    <v-dialog v-model="dialog"
              max-width="400"
              persistent>
      <v-alert v-if="success"
               type="success"
               prominent
               class="p-4"
               :title="$t('register-now.success-alert.title')">
        <p>{{ $t('register-now.success-alert.message') }}</p>
        <v-btn variant="outlined"
               class="mt-4"
               to="/auth/login">{{ $t("login") }} </v-btn>

      </v-alert>

      <v-alert v-if="error"
               type="error"
               prominent
               class="p-4 "
               :title="$t('register-now.error-alert.title')">
        <p>{{ $t('register-now.error-alert.message') }}</p>
        <v-btn variant="outlined"
               class="mt-4"
               @click="closeDialog">Close</v-btn>
      </v-alert>

    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { required as vuelidateRequired, email, minLength, maxLength, helpers } from '@vuelidate/validators'

const showPassword = ref(false)
const form = ref({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" })
const rules = {
  firstName: {
    required: helpers.withMessage($t('input.error.text.required', { field: "First name" }), vuelidateRequired),
    minLength: helpers.withMessage($t("input.error.text.min", { field: "Last name", min: 2 }), minLength(2)),
    maxLength: helpers.withMessage($t("input.error.text.max", { field: "Last name", max: 20 }), maxLength(20)),
  },
  lastName: {
    required: helpers.withMessage($t('input.error.text.required', { field: "Last name" }), vuelidateRequired),
    minLength: helpers.withMessage($t("input.error.text.min", { field: "Last name", min: 2 }), minLength(2)),
    maxLength: helpers.withMessage($t("input.error.text.max", { field: "Last name", max: 20 }), maxLength(20)),
  },
  email: {
    required: helpers.withMessage($t("input.error.email.required"), vuelidateRequired),
    email: helpers.withMessage($t("input.error.email.invalid"), email),
  },
  password: {
    required: helpers.withMessage($t("input.error.password.required"), vuelidateRequired),
    minLength: helpers.withMessage($t("input.error.password.min", { min: 2 }), minLength(6)),
    maxLength: helpers.withMessage($t("input.error.password.max", { max: 20 }), maxLength(20)),
    complex: helpers.withMessage(
      $t("input.error.password.complex"),
      (v: string) => /[A-Z]/.test(v) && /[a-z]/.test(v) && /[0-9]/.test(v)
    ),
  },
  confirmPassword: {
    required: helpers.withMessage($t("input.error.password.required"), vuelidateRequired),
    sameAsPassword: helpers.withMessage($t("input.error.password.match"), (v: string) => v === form.value.password)
  }
}

const v$ = useVuelidate(rules, form)

const error = ref<null | string>(null)
const success = ref(false)
const dialog = ref(false)

async function submit() {
  v$.value.$touch()
  const isValid = await v$.value.$validate()
  console.log("Form validation", isValid)
  if (!isValid) return

  await $fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form.value),

    onResponse({ response }) {
      console.log('Response', response)
      console.log('Response', response.status)
      console.log('Response', response._data)

      if (response._data.status === 200) {
        success.value = true
        dialog.value = true
      } else if (response._data.status === 401) {
        error.value = response._data.message
        dialog.value = true
      }
    },
  })
}

function closeDialog() {
  error.value = null
  dialog.value = false
}
</script>

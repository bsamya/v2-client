<template>
  <div>
    <v-text-field v-model="contact.fullName"
                  prepend-inner-icon="mdi-account"
                  density="compact"
                  label="Full Name"
                  :error-messages="error.fullName"></v-text-field>

    <v-text-field v-model="contact.title"
                  prepend-inner-icon="mdi-format-title"
                  density="compact"
                  label="Title"
                  :error-messages="error.title" />

    <v-text-field v-model="contact.email"
                  prepend-inner-icon="mdi-email-outline"
                  density="compact"
                  label="Email"
                  :error-messages="error.email" />

    <v-mask-input prepend-inner-icon="mdi-phone-outline"
                  density="compact"
                  v-model="contact.tel"
                  :error-messages="error.tel"
                  mask="phone"
                  label="Phone" />

    <v-select v-model="contact.notifications"
              :items="notificationTypes"
              label="Notifications"
              chips
              multiple />



    <div class="flex gp-2">
      <v-spacer></v-spacer>
      <v-btn @click="set">Save</v-btn>
      <v-btn @click="$emit('close', {})">Cancel</v-btn>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, email, minLength, maxLength } from '@vuelidate/validators'


function phoneValidator(phone: string): boolean {
  if (!phone) return false

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')

  // Must be exactly 10 digits
  return digits.length === 10
}

const contact = defineModel<CompanyContact>({ required: true })
const emits = defineEmits(['close', 'set'])

const rules = {
  fullName: {
    required: helpers.withMessage('Full Name is required', required),
    minLength: helpers.withMessage('Full Name must be at least 3 characters', minLength(3)),
    maxLength: helpers.withMessage('Full Name must be at most 64 characters', maxLength(64))
  },
  title: {
    required: helpers.withMessage('Title is required', required),
    minLength: helpers.withMessage('Title must be at least 2 characters', minLength(2)),
    maxLength: helpers.withMessage('Title must be at most 64 characters', maxLength(64))
  },
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage('Invalid email format', email)
  },
  tel: {
    required: helpers.withMessage('Phone number is required', required),
    phoneValidator: helpers.withMessage('Invalid phone number format', phoneValidator)
  }
}
const v$ = useVuelidate(rules, contact)

const error = computed(() => {
  const error: Record<string, string> = {}
  if (!v$.value.$error) return error
  v$.value.$errors.forEach(err => {
    error[err.$propertyPath] = normalizeMessage(err.$message)
  })
  return error
})

function normalizeMessage(msg: string | Ref<string>) {
  return typeof msg === 'string' ? msg : msg.value
}

async function set() {
  v$.value.$validate()
  if (v$.value.$error) {
    console.log('Validation failed')
    return
  }
  emits("set");
}
</script>

<style lang="scss" scoped></style>
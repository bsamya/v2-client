<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

const { $db } = useNuxtApp()
const companyStore = useCompanyStore()

// ----- State -----
const application = ref<GMP>({
  companyId: companyStore.activeCompanyId!,
  applicationId: crypto.randomUUID(),
  type: 'GMP',
  country: 'AE',
  language: 'en',
  copies: 1,
  authentication: false,
  products: [],
  hasAddendum: false,
  addendum: '',
  delivery: {
    method: ['prepaidLabel'],
    prepaidLabel: 'xyz',
    usps: null
  },
  documents: {
    GMPStatement: []
  },
  notifications: companyStore.notifications,
  status: 'draft',
  events: {
    created: null,
    lastUpdated: null,
  }
})

// ----- Stepper -----
const step = ref(1)
const maxStep = 4

const canNext = computed(() => {
  if (step.value === 1) {
    return (
      !!application.value.country &&
      !!application.value.language &&
      application.value.copies > 0
    )
  }
  if (step.value === 2) {
    return application.value.products.length > 0
  }
  if (step.value === 3) {
    if (application.value.delivery.method.includes('usps')) {
      return !!application.value.delivery.usps?.recipient
    }
    return true
  }
  return true
})

// ----- Firestore Save -----
const isSaving = ref(false)
const lastSavedAt = ref<Date | null>(null)

const saveApplication = async (status: 'draft' | 'submitted' = 'draft') => {
  if (isSaving.value) return
  isSaving.value = true
  try {
    const app = application.value
    const docRef = doc($db, 'companies', app.companyId, 'cfsApplications', app.applicationId)

    await setDoc(
      docRef,
      {
        ...app,
        step: step.value,
        status,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    )
    lastSavedAt.value = new Date()
  } catch (err) {
    console.error('Error saving application', err)
  } finally {
    isSaving.value = false
  }
}

// ----- Navigation -----
const goNext = async () => {
  if (!canNext.value) return

  await saveApplication('draft')

  if (step.value === maxStep) {
    await saveApplication('submitted')
    console.log('Application submitted:', application.value)
    return
  }
  step.value++
}

const goPrev = () => {
  if (step.value > 1) step.value--
}

// ----- Vuelidate -----
const rules = {
  country: { required: helpers.withMessage('Country is required', required) },
  language: { required: helpers.withMessage('Language is required', required) },
  copies: { required: helpers.withMessage('Copies is required', required) },
  products: {
    required: helpers.withMessage(
      'At least one product must be selected',
      required
    )
  },
  delivery: {
    required: helpers.withMessage('Delivery method is required', () => {
      if (
        !(
          application.value.delivery.method.includes('usps') ||
          application.value.delivery.method.includes('prepaidLabel')
        )
      ) return false

      if (
        application.value.delivery.method.includes('usps') &&
        !application.value.delivery.usps?.recipient
      ) return false

      if (
        application.value.delivery.method.includes('prepaidLabel') &&
        !application.value.delivery.prepaidLabel
      ) return false

      return true
    })
  },
  documents: {
    GMPStatement: {
      required: helpers.withMessage(
        'GMP Statement must be uploaded',
        (v: string[]) => v.length > 0
      )
    }
  }
}

const v$ = useVuelidate(rules, application)
v$.value.$validate()

import type { ErrorObject } from '@vuelidate/core'

const error = computed(() => {
  const out: Record<string, string[]> = {}

  v$.value.$errors.forEach((err: ErrorObject) => {
    const key = err.$propertyPath // e.g. 'country', 'documents.invoice'
    if (!out[key]) out[key] = []

    const msg = err.$message as string | undefined
    if (msg && !out[key].includes(msg)) {
      out[key].push(msg)
    }
  })

  return out
})

const stepperErrors = computed(() => {
  const e = { step1: true, step2: true, step3: true, step4: true }
  if (error.value['country'] || error.value['language'] || error.value['copies']) e.step1 = false
  if (error.value['products']) e.step2 = false
  if (error.value['delivery']) e.step3 = false
  if (error.value['documents.GMPStatement']) e.step4 = false
  return e
})
</script>

<template>
  <div>
    <v-stepper v-model="step"
               non-linear
               alt-labels>
      <v-toolbar title="GMP Application"
                 flat>
        <v-btn icon="mdi-close"
               to="/company/applications" />

      </v-toolbar>

      <v-stepper-header>
        <v-stepper-item :value="1"
                        title="Details"
                        subtitle="Certificate info"
                        :rules="[() => stepperErrors.step1]" />
        <v-stepper-item :value="2"
                        title="Products"
                        subtitle="Select products"
                        :rules="[() => stepperErrors.step2]" />
        <v-stepper-item :value="3"
                        title="Delivery"
                        subtitle="Delivery options"
                        :rules="[() => stepperErrors.step3]" />
        <v-stepper-item :value="4"
                        title="Docs & Review"
                        subtitle="Upload & confirm"
                        :rules="[() => stepperErrors.step4]" />
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item :value="1">
          <cfs-gmp-details v-model="application"
                           :error />
        </v-stepper-window-item>

        <v-stepper-window-item :value="2">
          <lazy-cfs-gmp-products v-model="application"
                                 :error />
        </v-stepper-window-item>

        <v-stepper-window-item :value="3">
          <lazy-cfs-gmp-delivery v-model="application" />
        </v-stepper-window-item>

        <v-stepper-window-item :value="4">
          <lazy-cfs-gmp-docs-review v-model="application"
                                    :error />
        </v-stepper-window-item>
      </v-stepper-window>

      <!-- Actions -->
      <div class="d-flex justify-space-between pa-4">
        <v-btn variant="text"
               :disabled="step === 1"
               @click="goPrev">Back</v-btn>
        <v-btn color="primary"
               :disabled="!canNext"
               @click="goNext">
          {{ step === maxStep ? 'Submit' : 'Next' }}
        </v-btn>
      </div>
    </v-stepper>
    <v-spacer />
    <div class="text-caption text-medium-emphasis">
      <span v-if="isSaving">Saving...</span>
      <span v-else-if="lastSavedAt">
        Saved at {{ lastSavedAt.toLocaleTimeString() }}
      </span>
      <span v-else>Not yet saved</span>
    </div>
  </div>


  <v-divider class="border-opacity-100"
             color="error"></v-divider>

</template>

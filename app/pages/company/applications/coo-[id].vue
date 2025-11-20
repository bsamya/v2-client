<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';

// ——— Page Meta ———
definePageMeta({
  title: "COO Application",
  meta: [
    { name: "description", content: "COO Application" },
    { name: "keywords", content: "COO" },
  ],
});

// ——— State ———
const step = ref(1) // 1..5
const maxStep = 4

// ——— Refs for step validations———
const main = ref({ isValid: true })
const options = ref({ isValid: true })
const shipment = ref({ isValid: true })
const documents = ref({ isValid: true })
const review = ref({ isValid: true })


// NOTE: Assuming type COO exists in your project.
const application = ref<COO>({
  applicationId: crypto.randomUUID(),
  certificateType: "COO",
  partnerCode: "",
  companyId: "",
  language: "en",
  status: "draft",
  seller: "",
  consignee: null,
  buyer: null,
  transportationType: "",
  transportType: "",
  portOfLoading: "",
  destinationCountry: "",
  destinationPort: "",
  consignorReference: "",
  importPermitNumber: "",
  billOfLadingNumber: "",
  ownerAgent: "",
  exportCarrier: "",
  forwardingAgent: "",
  exportDate: "",
  remarks: "",
  shipment: [],
  documents: {
    invoice: [],
    packingList: [],
    otherDocuments: [],
  },
  events: {
    created: null,
    lastUpdated: null,
  },
})


function prevStep() {
  if (step.value > 1) step.value--
}

const pdfKey = ref(0)
watch(() => step.value, async (newStep) => {
  if (newStep === maxStep) {
    // Regenerate PDF when reaching review step
    pdfKey.value++
  }
  // You can add logic here if needed when step changes
}, { immediate: true })



// Stub for save
function saveApplication() {
  // your save logic here (emit/store/Firestore/etc.)
  // e.g., await save(application.value)
}



const rules = {
  //main section
  consignee: { required: helpers.withMessage("Consignee is required", required) },
  transportType: { required: helpers.withMessage("Transportation type is required", required) },
  portOfLoading: { required: helpers.withMessage("Port of loading is required", required) },
  destinationCountry: { required: helpers.withMessage("Destination country is required", required) },
  destinationPort: { required: helpers.withMessage("Destination port is required", required) },

  //documents section
  documents: {
    invoice: { required: helpers.withMessage("At least one invoice is required", required) },
  },

  //shipment section
  shipment: {
    required: helpers.withMessage("At least one shipment item is required", () => application.value.shipment.length > 2),
    $each: helpers.forEach({
      description: { required: helpers.withMessage("Description is required", required) },
      grossWeight: { required: helpers.withMessage("Gross Weight is required", required) },
      countryOfOrigin: { required: helpers.withMessage("Country of Origin is required", required) },
    })
  },

  //step errors grouping
  $validationGroups: {
    main: ['consignee', 'transportType', 'portOfLoading', 'destinationCountry', 'destinationPort'],
    documents: ['documents.invoice'],
    shipment: ['shipment', 'shipment.$each.description', 'shipment.$each.grossWeight', 'shipment.$each.countryOfOrigin'],
  },
}

const v$ = useVuelidate();



// Check validity of current step before proceeding


async function nextStep() {
  // Validate current step before moving forward

  if (step.value < maxStep) step.value++
}</script>

<template>
  <v-container class="flex flex-col gap-2">
    <!-- Top Bar -->
    <v-toolbar color="info">
      <v-toolbar-title>
        COO <span class="text-xs">[{{ application.applicationId }}]</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn prepend-icon="mdi-content-save"
             text="Save Application"
             @click="saveApplication" />
    </v-toolbar>

    <!-- Stepper -->
    <v-stepper v-model="step"
               class="rounded-lg elevation-2">
      <!-- Header -->
      <v-stepper-header>
        <v-stepper-item :value="1"
                        title="Main"
                        subtitle="Company & basics"
                        editable
                        :error="main.isValid === false || options.isValid === false"
                        @click="step = 1" />
        <v-divider />

        <v-stepper-item :value="2"
                        title="Shipment"
                        subtitle="Logistics details"
                        editable
                        :error="shipment.isValid === false"
                        @click="step = 2" />
        <v-divider />
        <v-stepper-item :value="3"
                        title="Documents"
                        subtitle="Invoice & more"
                        editable
                        :error="documents.isValid === false"
                        @click="step = 3" />
        <v-divider />
        <v-stepper-item :value="4"
                        title="Review"
                        subtitle="Confirm & submit"
                        editable
                        @click="step = 4" />
      </v-stepper-header>

      <!-- Content -->
      <v-stepper-window>
        <v-stepper-window-item :value="1">

          <coo-main ref="main"
                    v-model="application" />

          <coo-options v-model="application"
                       ref="options" />
        </v-stepper-window-item>

        <v-stepper-window-item :value="2">
          <coo-shipment v-model="application"
                        ref="shipment" />
        </v-stepper-window-item>

        <v-stepper-window-item :value="3">
          <coo-documents ref="documents"
                         v-model="application" />
        </v-stepper-window-item>

        <v-stepper-window-item :value="4">
          <coo-review ref="review"
                      v-model="application"
                      :key="pdfKey" />
        </v-stepper-window-item>
      </v-stepper-window>

      <!-- Actions -->
      <v-stepper-actions @click:prev="prevStep"
                         @click:next="nextStep">
        <template #prev>
          <v-btn variant="tonal"
                 prepend-icon="mdi-chevron-left"
                 :disabled="step === 1"
                 @click="prevStep">
            Back
          </v-btn>
        </template>

        <template #next>
          <div class="d-flex align-center gap-2">
            <v-btn v-if="step < maxStep"
                   color="primary"
                   append-icon="mdi-chevron-right"
                   @click="nextStep">
              Next
            </v-btn>

            <v-btn v-else
                   color="success"
                   prepend-icon="mdi-content-save"
                   @click="saveApplication">
              Save & Finish
            </v-btn>
          </div>
        </template>
      </v-stepper-actions>
    </v-stepper>
    <v-btn @click="v$.$validate()"
           color="primary">Validate</v-btn>
    <div class="flex gap-2">
      <!-- <v-alert type="info">
        <pre>Main : {{ main }}</pre>
        <pre>Options : {{ options }}</pre>
        <pre>Shipment : {{ shipment }}</pre>
        <pre>Documents : {{ documents }}</pre>
        <pre>Review : {{ review }}</pre>
      </v-alert>
      <v-alert type="error">
        <pre>{{ v$.$errors }}</pre>
      </v-alert> -->

      <v-alert>
        <pre>{{ application }}</pre>
      </v-alert>

    </div>
  </v-container>
</template>

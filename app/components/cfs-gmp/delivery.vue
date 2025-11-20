<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { nanoid } from 'nanoid'
import {
  ref as storageRef,
  getDownloadURL,
  uploadBytesResumable,
  getMetadata
} from 'firebase/storage'
import type { UploadTask } from 'firebase/storage'

const application = defineModel<CFS_GMP>({ required: true })

const mailingAddressList: MailingAddress[] = [
  { id: '1', company: 'Acme Inc.', name: 'John Doe', address: '123 Main St', city: 'Springfield', state: 'IL', zip: '62701' },
  { id: '2', company: 'Beta LLC', name: 'Jane Smith', address: '456 Oak Ave', city: 'Madison', state: 'WI', zip: '53703' },
  { id: '3', company: 'Gamma Corp', name: 'Alice Johnson', address: '789 Pine Rd', city: 'Columbus', state: 'OH', zip: '43215' },
  { id: '4', company: 'Delta Co', name: 'Bob Brown', address: '321 Maple Ln', city: 'Austin', state: 'TX', zip: '73301' },
  { id: '5', company: 'Epsilon Inc', name: 'Carol White', address: '654 Cedar St', city: 'Denver', state: 'CO', zip: '80201' }
]

const companyStore = useCompanyStore()

// 🔹 Computed radio value for USPS vs Prepaid
const primaryDeliveryMethod = computed<('usps' | 'prepaidLabel') | null>({
  get() {
    const methods = application.value.delivery.method
    if (methods.includes('usps')) return 'usps'
    if (methods.includes('prepaidLabel')) return 'prepaidLabel'
    return null
  },
  set(value) {
    // Keep scanAndSend, but ensure only ONE of usps/prepaidLabel is set
    const methods: ('usps' | 'prepaidLabel' | 'scanAndSend')[] = application.value.delivery.method.filter(
      m => m !== 'usps' && m !== 'prepaidLabel'
    )

    if (value) {
      methods.push(value)
    }

    application.value.delivery.method = methods
  }
})

const mailingAddress = computed(() => {
  if (application.value.delivery.method.includes('usps') && !application.value.delivery.usps) return 'Select the mailing address for USPS delivery.'
  const recepient = application.value.delivery.usps?.recipient
  if (!recepient) return ''
  return recepient.address + ', ' + recepient.city + ', ' + recepient.state + ' ' + recepient.zip
})



// Keep your watcher but rely on method array as before
watch(
  () => application.value.delivery.method,
  (deliveryMethods) => {
    if (deliveryMethods.includes('usps')) {
      if (!application.value.delivery.usps) {
        application.value.delivery.usps = {
          recipient: null,
          trackingNumber: null,
          date: null
        }
      }
    } else {
      application.value.delivery.usps = null
    }

    if (deliveryMethods.includes('prepaidLabel')) {
      if (application.value.delivery.prepaidLabel == null) {
        application.value.delivery.prepaidLabel = ''
      }
    } else {
      application.value.delivery.prepaidLabel = null
    }
  },
  { immediate: true }
)
</script>

<template>
  <v-card class="mt-4">
    <v-card-title>Delivery Options</v-card-title>
    <v-card-text>
      <div class="flex flex-col gap-4">
        <!-- USPS vs Prepaid as radio -->
        <div class="flex flex-col gap-2">
          <v-radio-group v-model="primaryDeliveryMethod"
                         label="Delivery Method"
                         inline>
            <v-radio label="USPS Mailing"
                     value="usps" />
            <v-radio label="Prepaid Label"
                     value="prepaidLabel" />
          </v-radio-group>

          <!-- USPS section -->
          <div class="flex gap-2"
               v-if="primaryDeliveryMethod === 'usps'">
            <div class="flex-1">
              <v-autocomplete v-model="application.delivery.usps!.recipient"
                              :items="mailingAddressList"
                              item-value="id"
                              item-title="company"
                              item-subtitle="name"
                              return-object
                              prepend-inner-icon="mdi-mailbox"
                              label="Select Mailing Address"
                              :hint="mailingAddress"
                              persistent-hint>
                <template #append>
                  <v-btn icon
                         :to="'/mailing-address-new'"
                         size="small">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>

                <template #selection="{ item }">
                  <v-list-item :title="item.raw.company"
                               :subtitle="item.raw.name" />
                </template>

                <template #item="{ props, item }">
                  <v-list-item v-bind="props"
                               :title="item.raw.company"
                               :subtitle="item.raw.name">
                    <template #append>
                      <v-btn icon="mdi-pencil"
                             size="small" />
                    </template>
                  </v-list-item>
                </template>

                <template #append-item>
                  <v-list-item>
                    <v-btn block
                           color="primary"
                           text="Create a new address"
                           to="/mailing-address-new" />
                  </v-list-item>
                </template>
              </v-autocomplete>

              <div v-if="application.delivery.usps?.recipient"
                   class="mt-2 text-body-2">

              </div>
            </div>
          </div>

          <!-- Prepaid label section -->
          <div class="flex gap-2"
               v-if="primaryDeliveryMethod === 'prepaidLabel'">
            <div class="flex-1">
              <span class="text-caption text-medium-emphasis">
                Please upload your prepaid shipping label.
              </span>
            </div>
            <div class="flex-1">
              <upload-file v-if="application.delivery.prepaidLabel !== null"
                           :path="`applications/${companyStore.activeCompanyId}/${application.applicationId}`"
                           accept=".pdf,.png,.jpg"
                           label="Upload Prepaid Label"
                           v-model="application.delivery.prepaidLabel"
                           :files="application.delivery.prepaidLabel"
                           @set="url => application.delivery.prepaidLabel = url"
                           @unset="() => application.delivery.prepaidLabel = null" />
            </div>
          </div>
        </div>

        <v-divider class="border-opacity-100"
                   color="error"></v-divider>



        <!-- Scan and Send (still checkbox on method array) -->
        <div class="flex gap-2">
          <div class="flex-1">
            <v-checkbox v-model="application.delivery.method"
                        label="Digital scanned copies of the certificates"
                        value="scanAndSend" />
          </div>

          <div class="flex-1 flex gap-2">
            <v-chip v-for="recipient in application.notifications.Applications"
                    :key="recipient"
                    :disabled="!application.delivery.method.includes('scanAndSend')">
              {{ recipient }}
            </v-chip>
          </div>
        </div>

      </div>
    </v-card-text>
  </v-card>

</template>
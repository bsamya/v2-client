<template>
  <v-card title="Primary Information"
          outlined>
    <v-card-text class="grid grid-cols-2 gap-2">

      <!-- ------------------------------- -->
      <!-- Consignee ---------------------- -->
      <!-- ------------------------------- -->
      <div v-if="consignees.length > 0"
           class="flex gap-2">

        <v-autocomplete label="Select Consignee *"
                        v-model="application.consignee"
                        :items="consignees"
                        item-title="company"
                        item-value="addressId"
                        density="compact"
                        clearable
                        return-object
                        :error-messages="errors.consignee"
                        @update:modelValue="v$.consignee.$touch()">

          <!-- prepend-inner validation icon -->
          <template #prepend-inner>
            <validation-icons :v="v$.consignee" />
          </template>

          <!-- list item with edit button -->
          <template #item="{ item, props }">
            <v-list-item v-bind="props">
              <v-list-item-subtitle>{{ item.raw.name }}</v-list-item-subtitle>

              <template #append>
                <v-btn icon
                       size="small"
                       variant="text"
                       @click.stop.prevent="editAddress(item.raw)">
                  <v-icon icon="mdi-pencil" />
                </v-btn>
              </template>
            </v-list-item>
          </template>

        </v-autocomplete>

        <!-- plus button -->
        <v-tooltip activator="parent"
                   location="start"
                   text="Add new Consignee">
          <template #activator="{ props }">
            <v-btn v-bind="props"
                   icon="mdi-plus"
                   color="info"
                   size="small"
                   @click="addressId = null; activeAddressForm = 'consignee'">
            </v-btn>
          </template>
        </v-tooltip>

      </div>

      <v-btn v-else
             block
             color="info"
             @click="addressId = null; activeAddressForm = 'consignee'">
        Add New Consignee
      </v-btn>




      <!-- ------------------------------- -->
      <!-- Buyer -------------------------- -->
      <!-- ------------------------------- -->
      <div v-if="buyers.length > 0"
           class="flex gap-2">

        <v-autocomplete label="Select Buyer *"
                        v-model="application.buyer"
                        :items="buyers"
                        item-title="company"
                        item-value="addressId"
                        density="compact"
                        clearable
                        return-object
                        :error-messages="errors.buyer"
                        @update:modelValue="v$.buyer.$touch()">

          <!-- prepend-inner validation icon -->
          <template #prepend-inner>
            <validation-icons :v="v$.buyer" />
          </template>

          <!-- list items -->
          <template #item="{ item, props }">
            <v-list-item v-bind="props">
              <v-list-item-subtitle>{{ item.raw.name }}</v-list-item-subtitle>

              <template #append>
                <v-btn icon
                       size="small"
                       variant="text"
                       @click.stop.prevent="editAddress(item.raw)">
                  <v-icon icon="mdi-pencil" />
                </v-btn>
              </template>
            </v-list-item>
          </template>

        </v-autocomplete>

        <v-tooltip text="Add New Buyer">
          <template #activator="{ props }">
            <v-btn v-bind="props"
                   icon="mdi-plus"
                   color="info"
                   size="small"
                   @click="addressId = null; activeAddressForm = 'buyer'">
            </v-btn>
          </template>
        </v-tooltip>
      </div>

      <v-btn v-else
             block
             color="info"
             @click="addressId = null; activeAddressForm = 'buyer'">
        Add New Buyer
      </v-btn>


      <!-- ------------------------------- -->
      <!-- Transportation Type ------------ -->
      <!-- ------------------------------- -->
      <v-select label="Transportation Type *"
                v-model="application.transportType"
                :items="transportationTypes"
                density="compact"
                :error-messages="errors.transportType"
                @update:modelValue="v$.transportType.$touch()">
        <template #prepend-inner>
          <validation-icons :v="v$.transportType" />
        </template>
      </v-select>



      <!-- ------------------------------- -->
      <!-- Port of Loading ---------------- -->
      <!-- ------------------------------- -->
      <v-text-field label="Port of Loading or City *"
                    v-model="application.portOfLoading"
                    density="compact"
                    clearable
                    :error-messages="errors.portOfLoading"
                    @blur="v$.portOfLoading.$touch()">
        <template #prepend-inner>
          <validation-icons :v="v$.portOfLoading" />
        </template>
      </v-text-field>



      <!-- ------------------------------- -->
      <!-- Destination Country ------------ -->
      <!-- ------------------------------- -->
      <v-select label="Destination Country *"
                v-model="application.destinationCountry"
                :items="countryStore.data"
                density="compact"
                clearable
                :error-messages="errors.destinationCountry"
                @update:modelValue="v$.destinationCountry.$touch()">
        <template #prepend-inner>
          <validation-icons :v="v$.destinationCountry" />
        </template>
      </v-select>




      <!-- ------------------------------- -->
      <!-- Destination Port ---------------- -->
      <!-- ------------------------------- -->
      <v-text-field label="Destination *"
                    v-model="application.destinationPort"
                    density="compact"
                    clearable
                    :error-messages="errors.destinationPort"
                    @blur="v$.destinationPort.$touch()">
        <template #prepend-inner>
          <validation-icons :v="v$.destinationPort" />
        </template>
      </v-text-field>

    </v-card-text>


    <address-form v-if="activeAddressForm"
                  :key="addressformKey"
                  :type="activeAddressForm"
                  :address-id="addressId"
                  @close="closeAddressForm" />
  </v-card>
</template>



<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, minLength, maxLength } from '@vuelidate/validators'
import { close } from 'fs'

const application = defineModel<COO>({ required: true })
const countryStore = useCountryStore()
const companyStore = useCompanyStore()

const { buyers, consignees } = storeToRefs(companyStore)


const rules = {
  // main section
  consignee: {
    required: helpers.withMessage(
      'Please select a consignee for this shipment.',
      required
    ),
  },
  buyer: {
    required: helpers.withMessage(
      'Please select a buyer for this shipment.',
      required
    ),
  },
  transportType: {
    required: helpers.withMessage(
      'Please choose a transportation type (Air, Sea, Road, etc.).',
      required
    ),
  },
  portOfLoading: {
    required: helpers.withMessage(
      'Port of loading or city is required.',
      required
    ),
    minLength: helpers.withMessage(
      'Port of loading or city must be at least 3 characters long.',
      minLength(3)
    ),
    maxLength: helpers.withMessage(
      'Port of loading or city must be no more than 60 characters long.',
      maxLength(60)
    ),
  },
  destinationCountry: {
    required: helpers.withMessage(
      'Please select the destination country.',
      required
    ),
  },
  destinationPort: {
    required: helpers.withMessage(
      'Destination (port or city) is required.',
      required
    ),
    minLength: helpers.withMessage(
      'Destination must be at least 3 characters long.',
      minLength(3)
    ),
    maxLength: helpers.withMessage(
      'Destination must be no more than 60 characters long.',
      maxLength(60)
    ),
  },
}


const v$ = useVuelidate(rules, application as any)

const errors = computed(() => {
  return validationErrors(v$.value)
})

const activeAddressForm = ref<'buyer' | 'consignee' | null>(null)



const addressId = ref<string | null>(null)
const addressformKey = ref(0)
function editAddress(address: Address) {
  addressId.value = address.addressId
  activeAddressForm.value = address.type

  // You might want to pass the address ID to the form for editing
  // This can be done via an event or a shared state
  // For simplicity, we'll just log it here
  console.log('Editing address with ID:', address.addressId)
}

function closeAddressForm() {
  activeAddressForm.value = null
  addressformKey.value++
}



// Expose validity state to parent
defineExpose({
  isValid: computed(() => {
    if (v$.value.$dirty) {
      return !v$.value.$invalid
    }
    return true
  }),
})
</script>

<template>
  <v-card title="Primary Information"
          outlined>


    <h1>*** {{ activeAddressForm }} ***</h1>
    <v-card-text class="grid grid-cols-2 gap-2">
      <!-- Consignee -->
      <div v-if="consigneeList.length > 0"
           class="flex gap-2">
        <v-autocomplete label="Select Consignee *"
                        v-model="application.consignee"
                        :items="consigneeList"
                        density="compact"
                        item-title="name"
                        item-value="addressId"
                        clearable
                        return-object
                        :error-messages="errors.consignee"
                        @blur="v$.consignee.$touch()">
          <template #append-inner>
            <v-icon v-if="v$.consignee.$error"
                    color="error"
                    size="20"
                    class="mr-2"
                    icon="mdi-alert-circle" />

            <v-icon v-else-if="v$.consignee.$dirty"
                    color="success"
                    size="20"
                    class="mr-2"
                    icon="mdi-check-circle" />
          </template>
        </v-autocomplete>

        <v-tooltip activator="parent">
          <template #activator="{ props }">
            <v-btn v-bind="props"
                   icon="mdi-plus"
                   color="info"
                   size="small">

            </v-btn>
          </template>
          <span>Add New Consignee</span>
        </v-tooltip>
      </div>
      <v-btn v-else
             block
             color="info"
             @click="activeAddressForm = 'consignee'">Add New Consignee</v-btn>


      <!-- Buyer -->
      <div class="flex gap-2"
           v-if="buyerList.length > 0">
        <v-autocomplete label="Select Buyer *"
                        v-model="application.buyer"
                        :items="buyerList"
                        item-title="name"
                        item-value="addressId"
                        clearable
                        density="compact"
                        return-object
                        :error-messages="errors.buyer"
                        @blur="v$.buyer.$touch()">
          <template #append-inner>
            <v-icon v-if="v$.buyer.$error"
                    color="error"
                    size="20"
                    class="mr-2"
                    icon="mdi-alert-circle" />

            <v-icon v-else-if="v$.buyer.$dirty"
                    color="success"
                    size="20"
                    class="mr-2"
                    icon="mdi-check-circle" />
          </template>
        </v-autocomplete>

        <v-tooltip activator="parent">
          <template #activator="{ props }">
            <v-btn v-bind="props"
                   icon="mdi-plus"
                   color="info"
                   size="small">

            </v-btn>
          </template>
          <span>Add New Buyer</span>
        </v-tooltip>
      </div>
      <v-btn v-else
             class="mb-4"
             color="info"
             @click="activeAddressForm = 'buyer'">Add New Buyer</v-btn>
      <!-- Buyer -->


      <!-- Transportation Type -->
      <v-select label="Transportation Type *"
                v-model="application.transportType"
                :items="transportationTypes"
                density="compact"
                :error-messages="errors.transportType"
                @blur="v$.transportType.$touch()">
        <template #append-inner>
          <v-icon v-if="v$.transportType.$error"
                  icon="mdi-alert-circle"
                  color="error"
                  size="20"
                  class="mr-2" />

          <v-icon v-else-if="v$.transportType.$dirty"
                  icon="mdi-check-circle"
                  color="success"
                  size="20"
                  class="mr-2" />
        </template>
      </v-select>

      <!-- Port of Loading -->
      <v-text-field label="Port of Loading or City *"
                    v-model="application.portOfLoading"
                    density="compact"
                    clearable
                    :error-messages="errors.portOfLoading"
                    @blur="v$.portOfLoading.$touch()">
        <template #append-inner>
          <v-icon v-if="v$.portOfLoading.$error"
                  icon="mdi-alert-circle"
                  color="error"
                  size="20"
                  class="mr-2" />

          <v-icon v-else-if="v$.portOfLoading.$dirty"
                  icon="mdi-check-circle"
                  color="success"
                  size="20"
                  class="mr-2" />
        </template>
      </v-text-field>

      <!-- Destination Country -->
      <v-select v-model="application.destinationCountry"
                :items="countryStore.data"
                clearable
                density="compact"
                label="Destination Country *"
                :error-messages="errors.destinationCountry"
                @blur="v$.destinationCountry.$touch()">
        <template #append-inner>
          <v-icon v-if="v$.destinationCountry.$error"
                  icon="mdi-alert-circle"
                  color="error"
                  size="20"
                  class="mr-2" />

          <v-icon v-else-if="v$.destinationCountry.$dirty"
                  icon="mdi-check-circle"
                  color="success"
                  size="20"
                  class="mr-2" />
        </template>
      </v-select>

      <!-- Destination Port -->
      <v-text-field label="Destination *"
                    v-model="application.destinationPort"
                    density="compact"
                    clearable
                    :error-messages="errors.destinationPort"
                    @blur="v$.destinationPort.$touch()">
        <template #append-inner>
          <v-icon v-if="v$.destinationPort.$error"
                  icon="mdi-alert-circle"
                  color="error"
                  size="20"
                  class="mr-2" />

          <v-icon v-else-if="v$.destinationPort.$dirty"
                  icon="mdi-check-circle"
                  color="success"
                  size="20"
                  class="mr-2" />
        </template>
      </v-text-field>
    </v-card-text>
    <address-form v-if="activeAddressForm"
                  :type="activeAddressForm"
                  @close="activeAddressForm = null" />
  </v-card>


</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, minLength, maxLength } from '@vuelidate/validators'

const application = defineModel<COO>({ required: true })
const countryStore = useCountryStore()
const companyStore = useCompanyStore()
const { addressList } = storeToRefs(companyStore)

const transportationTypes = ['Air', 'Road', 'Sea', 'Rail']
const buyerList = addressList.value.filter(addr => addr.type === 'buyer')
const consigneeList = addressList.value.filter(addr => addr.type === 'consignee')
const rules = {
  // main section
  consignee: {
    required: helpers.withMessage('Required', required),
  },
  buyer: {
    required: helpers.withMessage('Required', required),
  },
  transportType: {
    required: helpers.withMessage('Required', required),
  },
  portOfLoading: {
    required: helpers.withMessage('Required', required),
    minLength: helpers.withMessage(
      'Must be 3–60 characters',
      minLength(3)
    ),
    maxLength: helpers.withMessage(
      'Must be 3–60 characters',
      maxLength(60)
    ),
  },
  destinationCountry: {
    required: helpers.withMessage('Required', required),
  },
  destinationPort: {
    required: helpers.withMessage('Required', required),
    minLength: helpers.withMessage(
      'Must be 3–60 characters',
      minLength(3)
    ),
    maxLength: helpers.withMessage(
      'Must be 3–60 characters',
      maxLength(60)
    ),
  },
}

const v$ = useVuelidate(rules, application as any)

const errors = computed(() => {
  return validationErrors(v$.value)
})

const activeAddressForm = ref<'buyer' | 'consignee' | null>(null)


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

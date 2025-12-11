<template>
  <v-dialog width="600"
            v-model="dialog"
            @click:outside="$emit('close')">
    <v-toolbar color="primary"
               :title="`${type} information`">
      <v-btn icon="mdi-close"
             variant="text"
             @click="$emit('close')" />
    </v-toolbar>
    <div class="bg-white p-4">
      <v-form @submit.prevent="submit">
        <v-select v-model="address.type"
                  :items="['buyer', 'consignee']"
                  label="Address Type"
                  density="compact" />

        <v-text-field v-model="address.company"
                      label="Company Name *"
                      density="compact"
                      :error-messages="errors.company"
                      @blur="v$.company.$touch()">
          <template #prepend-inner>
            <validation-icons :v="v$.company" />
          </template>
        </v-text-field>

        <v-text-field v-model="address.name"
                      label="Contact Name *"
                      density="compact"
                      :error-messages="errors.name"
                      @blur="v$.name.$touch()">
          <template #prepend-inner>
            <validation-icons :v="v$.name" />
          </template>
        </v-text-field>

        <v-text-field v-model="address.address1"
                      label="Street Address *"
                      density="compact"
                      :error-messages="errors.address1"
                      @blur="v$.address1.$touch()">
          <template #prepend-inner>
            <validation-icons :v="v$.address1" />
          </template>
        </v-text-field>

        <v-text-field v-model="address.address2"
                      label="Address Line 2"
                      density="compact"
                      @blur="v$.address2.$touch()">
          <template #prepend-inner>
            <validation-icons :v="v$.address2" />
          </template>
        </v-text-field>

        <v-text-field v-model="address.city"
                      label="City *"
                      density="compact"
                      :error-messages="errors.city"
                      @blur="v$.city.$touch()">
          <template #prepend-inner>
            <validation-icons :v="v$.city" />
          </template>
        </v-text-field>

        <v-text-field v-model="address.state"
                      label="State/Province"
                      density="compact">
          <template #prepend-inner>
            <validation-icons :v="v$.state" />
          </template>
        </v-text-field>

        <v-text-field v-model="address.postalCode"
                      label="Postal Code"
                      density="compact">
          <template #prepend-inner>
            <validation-icons :v="v$.postalCode" />
          </template>
        </v-text-field>

        <v-select v-model="address.country"
                  :items="countryStore.data"
                  label="Country *"
                  density="compact"
                  :error-messages="errors.country"
                  @blur="v$.country.$touch()">
          <template #prepend-inner>
            <validation-icons :v="v$.country" />
          </template>
        </v-select>

        <v-btn type="submit">Save</v-btn>
      </v-form>
    </div>

  </v-dialog>
</template>

<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, minLength, maxLength } from "@vuelidate/validators";
const emits = defineEmits<{
  (e: "close"): void;
}>();
const props = withDefaults(
  defineProps<{
    type: 'buyer' | 'consignee',
    addressId: string | null,

  }>(),
  {
    type: 'buyer', // <-- default value here
    addressId: null
  }
)

const countryStore = useCountryStore();
const dialog = ref(true);
const companyStore = useCompanyStore();



const address = ref<Address>({
  addressId: props.addressId || crypto.randomUUID(),
  type: props.type,
  company: '',
  name: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  isDeleted: false,
});




const rules = computed(() => ({
  company: {
    required: helpers.withMessage('Company Name is required', required),
    minLength: helpers.withMessage('Company Name must be at least 2 characters', minLength(2)),
    maxLength: helpers.withMessage('Company Name must be at most 60 characters', maxLength(60)),
  },
  name: {
    required: helpers.withMessage('Contact Name is required', required),
    maxLength: helpers.withMessage('Contact Name must be at most 60 characters', maxLength(60)),
  },

  address1: {
    required: helpers.withMessage('Street Address is required', required),
    minLength: helpers.withMessage('Street Address must be at least 2 characters', minLength(2)),
    maxLength: helpers.withMessage('Street Address must be at most 100 characters', maxLength(100)),
  },
  address2: {
    maxLength: helpers.withMessage('Address Line 2 must be at most 100 characters', maxLength(100)),
  },
  state: {
    maxLength: helpers.withMessage('State/Province must be at most 60 characters', maxLength(60)),
  },
  postalCode: {
    maxLength: helpers.withMessage('Postal Code must be at most 20 characters', maxLength(20)),
  },
  city: { required: helpers.withMessage('City is required', required) },
  country: { required: helpers.withMessage('Country is required', required) },
}));

const v$ = useVuelidate(rules, address);
const errors = computed(() => {
  return validationErrors(v$.value);
});


if (props.addressId) {
  if (companyStore.addressMap.has(props.addressId)) {
    address.value = JSON.parse(JSON.stringify(companyStore.addressMap.get(props.addressId)))
    await v$.value.$validate();
  } else {
    console.warn(`Address with ID ${props.addressId} not found in store.`)
  }

}


async function submit() {
  await v$.value.$validate();
  if (v$.value.$invalid) {
    return;
  }
  // Save the address data
  console.log('Address data is valid:', address.value);
  // You can emit an event or call an API to save the data here
  companyStore.setAddress(address.value)
    .then(() => {
      emits('close');
    })
    .catch((error) => {
      console.error('Error saving address:', error);
    });
}

</script>

<style scoped></style>
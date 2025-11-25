<template>
  <v-dialog width="600"
            v-model="dialog">
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
                      @blur="v$.company.$touch()" />

        <v-text-field v-model="address.name"
                      label="Contact Name *"
                      density="compact"
                      :error-messages="errors.name"
                      @blur="v$.name.$touch()" />

        <v-text-field v-model="address.address1"
                      label="Street Address *"
                      density="compact"
                      :error-messages="errors.address1"
                      @blur="v$.address1.$touch()" />

        <v-text-field v-model="address.address2"
                      label="Address Line 2"
                      density="compact"
                      @blur="v$.address2.$touch()" />

        <v-text-field v-model="address.city"
                      label="City *"
                      density="compact"
                      :error-messages="errors.city"
                      @blur="v$.city.$touch()" />

        <v-text-field v-model="address.state"
                      label="State/Province"
                      density="compact" />

        <v-text-field v-model="address.postalCode"
                      label="Postal Code"
                      density="compact" />

        <v-select v-model="address.country"
                  :items="countryStore.data"
                  label="Country *"
                  density="compact"
                  :error-messages="errors.country"
                  @blur="v$.country.$touch()" />


        <v-btn type="submit">Save</v-btn>
      </v-form>
      <pre>{{ address }}  </pre>
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
    addressId?: string
  }>(),
  {
    type: 'buyer', // <-- default value here
    addressId: undefined
  }
)

const countryStore = useCountryStore();
const dialog = ref(true);
const companyStore = useCompanyStore();



const address = ref<Address>({
  addressId: '',
  companyId: companyStore.activeCompanyId!,
  type: props.type,
  company: '',
  name: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
});

if (props.addressId) {
  // Load existing address data here if needed
  // For example:
  // address.value = await fetchAddressById(props.addressId);
}


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
  city: { required: helpers.withMessage('City is required', required) },
  country: { required: helpers.withMessage('Country is required', required) },
}));

const v$ = useVuelidate(rules, address);
const errors = computed(() => {
  return validationErrors(v$.value);
});

function submit() { }


</script>

<style scoped></style>
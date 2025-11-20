<template>
  <v-card title="Primary Information"
          outlined>
    <v-card-text class="grid grid-cols-2 gap-2">
      <v-autocomplete label="Select Consignee"
                      v-model="application.consignee"
                      :items="consignees"
                      density="compact"
                      item-title="name"
                      item-value="addressId"
                      clearable
                      hide-details="auto"
                      return-object
                      :error-messages="v$.consignee.$errors.map(e => e.$message as string)"
                      @blur="v$.consignee.$touch()" />

      <v-autocomplete label="Select Buyer"
                      v-model="application.buyer"
                      hide-details="auto"
                      :items="buyers"
                      item-title="name"
                      item-value="addressId"
                      clearable
                      density="compact"
                      return-object
                      :error-messages="v$.buyer.$errors.map(e => e.$message as string)"
                      @blur="v$.buyer.$touch()" />

      <v-select label="Transportation Type *"
                v-model="application.transportType"
                :items="transportationTypes"
                density="compact"
                hide-details="auto"
                :error-messages="v$.transportType.$errors.map(e => e.$message as string)"
                @blur="v$.transportType.$touch()" />

      <v-text-field label="Port of Loading or City *"
                    v-model="application.portOfLoading"
                    density="compact"
                    hide-details="auto"
                    :error-messages="v$.portOfLoading.$errors.map(e => e.$message as string)"
                    @blur="v$.portOfLoading.$touch()" />

      <v-select v-model="application.destinationCountry"
                :items="countryStore.data"
                clearable
                density="compact"
                hint="Select destination country"
                label="Destination Country"
                :error-messages="v$.destinationCountry.$errors.map(e => e.$message as string)"
                @blur="v$.destinationCountry.$touch()" />

      <v-text-field label="Destination *"
                    v-model="application.destinationPort"
                    density="compact"
                    hint="Destination port or city"
                    :error-messages="v$.destinationPort.$errors.map(e => e.$message as string)"
                    @blur="v$.destinationPort.$touch()" />
    </v-card-text>


    <pre>{{ v$.$invalid }} {{ v$.$dirty }} </pre>
  </v-card>
</template>

<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

const application = defineModel<COO>({ required: true });
const countryStore = useCountryStore();
const transportationTypes = ["Air", "Road", "Sea", "Rail"];
const buyers = addressList.filter(addr => addr.type === "buyer");
const consignees = addressList.filter(addr => addr.type === "consignee");

const rules = {
  //main section
  consignee: { required: helpers.withMessage("Consignee is required", required) },
  buyer: { required: helpers.withMessage("Buyer is required", required) },
  transportType: { required: helpers.withMessage("Transportation type is required", required) },
  portOfLoading: { required: helpers.withMessage("Port of loading is required", required) },
  destinationCountry: { required: helpers.withMessage("Destination country is required", required) },
  destinationPort: { required: helpers.withMessage("Destination port is required", required) },
}

const v$ = useVuelidate(rules, application as any);

// Expose validity state to parent
defineExpose({
  isValid: computed(() => {
    if (v$.value.$dirty) {
      return !v$.value.$invalid
    }
    return true
  }),
});
</script>

<template>
  <div>
    <div class="grid grid-col-1 gap-2"
         v-if="application.destinationCountry">
      <!--==============================-->
      <p class="font-bold text-xl col-span-2 pt-2">Document Authentication Services</p>

      <div class="flex gap-4align-center col-span-2"
           v-if="countryStore.country[application.destinationCountry].nusacc">
        <p class="text-lg">
          Would you like your documents to be certified by National Arab US Chamber of
          Commerce
        </p>
        <LazyInfoNusacc />
        <div>
          <v-radio-group v-if="countryStore.country[application.destinationCountry].nusacc"
                         v-model="application.nusaccAuthenticate"
                         inline
                         hide-details="auto"
                         color="primary">
            <v-radio label="Yes"
                     :value="true"></v-radio>
            <v-radio label="No"
                     :value="false"></v-radio>
          </v-radio-group>
        </div>
      </div>

      <div class="flex gap-4align-center col-span-2">
        <p class="text-lg">
          Would you like your documents to be {{ authenticationType }}
        </p>
        <LazyInfoApostille />
        <div>
          <v-radio-group v-model="application.authentication"
                         hide-details="auto"
                         inline
                         color="primary">
            <v-radio label="Yes"
                     :value="true"></v-radio>
            <v-radio label="No"
                     :value="false"></v-radio>
          </v-radio-group>
        </div>
      </div>

      <h6 class="font-bold text-xl col-span-2">Delivery Options</h6>

      <div class="flex gap-2 align-center col-span-2">
        <p class="text-lg">Delivery method</p>
        <span>
          <v-radio-group inline
                         hide-details="auto"
                         v-model="application.deliveryMethod">
            <v-radio label="Mail"
                     value="mail"
                     color="primary"></v-radio>
            <v-radio label="Prepaid Mailing Label"
                     value="prepaidLabel"
                     color="primary"></v-radio>
          </v-radio-group>
        </span>

        <div class="flex-grow">
          <v-select label="Select Mailing Address"
                    v-if="application.deliveryMethod === 'mail'"
                    v-model="application.mailingAddress"
                    :items="addressStore.mailingAddresses"
                    hide-details="auto"
                    item-title="name"
                    item-value="addressId"
                    color="primary"></v-select>
          <UploadFile label="Upload Prepaid label"
                      v-if="application.deliveryMethod === 'prepaidLabel'"
                      :files="application.mailingLabel"
                      :path="documentPath"
                      hide-details="auto"
                      @update="(doc) => (application.mailingLabel = doc)"
                      @remove="application.mailingLabel = null"></UploadFile>
        </div>
      </div>

      <div class="flex gap-2 align-center col-span-2">
        <p class="text-lg">Do you want to receive scanned copies of your documents?</p>
        <div class="flex-grow">
          <v-radio-group v-model="application.scannedCopies"
                         hide-details="auto"
                         inline
                         color="primary">
            <v-radio label="Yes"
                     :value="true"></v-radio>
            <v-radio label="No"
                     :value="false"></v-radio>
          </v-radio-group>
        </div>
      </div>
      <!--==============================-->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { helpers, required, requiredIf } from "@vuelidate/validators";

const countryStore = useCountryStore();
const addressStore = useAddressStore();

const application = inject("application") as Ref<COO>;
const documentPath = inject("documentPath") as ComputedRef<string>;

const authenticationType = computed(() => {
  if (application.value.authentication) {
    return "Apostilled";
  } else {
    return "Notarized";
  }
});
const rules = {
  documents: {
    invoice: { required: helpers.withMessage("Invoice is required", required) },
  },
  mailingAddress: {
    required: helpers.withMessage(
      "Address is required",
      requiredIf(application.value.mailingAddress !== null)
    ),
  },
  mailingLabel: {
    required: helpers.withMessage(
      "Mailing label is required",
      requiredIf(application.value.deliveryMethod === "prepaidLabel")
    ),
  },
};

const v$ = useVuelidate(rules, application);
await v$.value.$validate();
</script>

<style scoped></style>

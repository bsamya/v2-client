<template>
  <div class="grid grid-cols-2 gap-2">
    <p class="font-bold col-span-2 pt-2">Documents</p>

    <upload-file label="Upload Invoice"
                 density="compact"
                 class="col-span-2"
                 :path="`/applications/${application.companyId}/${application.applicationId}`"
                 :files="application.documents.invoice"
                 :error-messages="v$.invoice.$errors.map(e => e.$message as string)"
                 @set="(url: string) => set(url, 'invoice')"
                 @unset="(url: string) => unset(url, 'invoice')" />

    <upload-file label="Upload Packing List"
                 class="col-span-2"
                 :path="`/applications/${application.companyId}/${application.applicationId}`"
                 :files="application.documents.packingList"
                 @set="(url: string) => set(url, 'packingList')"
                 @unset="(url: string) => unset(url, 'packingList')" />

    <upload-file label="Upload other documents"
                 class="col-span-2"
                 :path="`/applications/${application.companyId}/${application.applicationId}`"
                 :files="application.documents.otherDocuments"
                 @set="(url: string) => set(url, 'otherDocuments')"
                 @unset="(url: string) => unset(url, 'otherDocuments')" />
  </div>
  <!-- <CooAuthentication v-if="application.destinationCountry" /> -->


  <pre>{{ v$.$errors }}</pre>
</template>

<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";


const application = defineModel<COO>({ required: true });

type DocType = 'invoice' | 'packingList' | 'otherDocuments';
const set = (url: string, type: DocType) => {
  application.value.documents[type].push(url);
};
const unset = (url: string, type: DocType) => {
  application.value.documents[type] = application.value.documents[type].filter((item: string) => item !== url);
};

const rules = {
  "invoice": { required: helpers.withMessage("At least one invoice is required", required) },
}

const v$ = useVuelidate(rules, application.value.documents);

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


<style scoped></style>

<template>
  <v-card class="mt-4">
    <v-card-title>Documents &amp; Review</v-card-title>
    <v-card-text class="flex flex-col gap-6">
      <!-- Invoices (multi-file) -->
      <div class="flex flex-col gap-2"
           v-if="application.type === 'CFS'">
        <span class="text-body-2 font-medium">Invoices (PDF)</span>

        <upload-file class="flex-1"
                     :path="`applications/${application.companyId}/${application.applicationId}`"
                     accept=".pdf"
                     label="Upload Invoice (PDF)"
                     :multiple="true"
                     :files="application.type === 'CFS' ? application.documents.invoice : []"
                     :max-files="3"
                     :error-messages="props.error['documents.invoice']"
                     @set="(url: string) => { if (application.type === 'CFS') application.documents.invoice.push(url) }"
                     @unset="(url: string) => { if (application.type === 'CFS') application.documents.invoice = application.documents.invoice.filter((u: string) => u !== url) }" />
      </div>

      <!-- Manufacturing statement (single) -->
      <div class="flex flex-col gap-2"
           v-if="application.type === 'CFS'">
        <span class="text-body-2 font-medium">Manufacturing Statement (PDF)</span>

        <upload-file :path="`applications/${application.companyId}/${application.applicationId}`"
                     accept=".pdf"
                     label="Upload Manufacturing Statement (PDF)"
                     :files="application.type === 'CFS' ? application.documents.manufacturingStatement : []"
                     :error-messages="props.error['documents.manufacturingStatement']"
                     @set="(url: string) => { if (application.type === 'CFS') application.documents.manufacturingStatement.push(url) }"
                     @unset="(url: string) => { if (application.type === 'CFS') application.documents.manufacturingStatement = application.documents.manufacturingStatement.filter((u: string) => u !== url) }" />
      </div>


      <!-- Good Manufacturing statement (single) -->
      <div class="flex flex-col gap-2"
           v-if="application.type === 'GMP'">
        <span class="text-body-2 font-medium">Manufacturing Statement (PDF)</span>

        <upload-file :path="`applications/${application.companyId}/${application.applicationId}`"
                     accept=".pdf"
                     label="Upload Manufacturing Statement (PDF)"
                     :files="application.type === 'GMP' ? application.documents.GMPStatement : []"
                     :error-messages="props.error['documents.GMPStatement']"
                     @set="(url: string) => { if (application.type === 'GMP') application.documents.GMPStatement.push(url) }"
                     @unset="(url: string) => { if (application.type === 'GMP') application.documents.GMPStatement = application.documents.GMPStatement.filter((u: string) => u !== url) }" />
      </div>
    </v-card-text>


    <v-alert type="error"
             title="Errors">
      <pre>{{ props.error }} }}</pre>
    </v-alert>
    <pre>{{ application }}</pre>



  </v-card>
</template>

<script setup lang="ts">
const application = defineModel<CFS_GMP>({ required: true })
const props = defineProps<{
  error: Record<string, string[]>
}>()


</script>

<style scoped></style>
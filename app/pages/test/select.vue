<template>
  <v-select v-model="company"
            ref="companySelect"
            :items="companyStore.companyList"
            item-title="companyId"
            item-value="companyId"
            hide-details>

  </v-select>

  <pre>companyStore.activeCompanyId: {{ companyStore.activeCompanyId }}</pre>
  <pre>company: {{ company }}</pre>
</template>
<script setup lang="ts">
const companyStore = useCompanyStore()
const companySelect = ref()

const company = computed({
  get: () => companyStore.activeCompanyId,
  set: (value) => companyStore.activeCompanyId = value
})

</script>
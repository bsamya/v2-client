<template>
  <v-select v-model="company"
            ref="companySelect"
            :items="companyStore.companyList"
            item-title="company"
            item-value="companyId"
            hide-details>
    <template #selection="{ item }">
      <v-list-item :title="item.raw.company"
                   :subtitle="item.raw.partner">
        <template #prepend>
          <v-avatar size="64"
                    class="mr-3">
            <img :src="item.raw.partnerLogo"
                 alt="Partner Logo">
          </v-avatar>
        </template>
      </v-list-item>
    </template>

    <template #item="{ props, item }">
      <v-list-item v-bind="props"
                   :title="item.raw.company"
                   :subtitle="item.raw.partner">
        <template #prepend>
          <v-avatar size="64"
                    class="mr-3">
            <img :src="item.raw.partnerLogo"
                 alt="Partner Logo">
          </v-avatar>
          <div>

          </div>
        </template>
      </v-list-item>
    </template>

    <template #append-item>
      <v-list-item>
        <v-btn block
               color="primary"
               text="Create a new company"
               to="/company-new"
               @click="() => { companySelect.menu = false }" />
      </v-list-item>
    </template>
  </v-select>


</template>
<script setup lang="ts">
const companyStore = useCompanyStore()
const companySelect = ref()

const company = computed({
  get: () => companyStore.activeCompanyId,
  set: (value) => companyStore.setActiveCompany(value || undefined)
})

</script>
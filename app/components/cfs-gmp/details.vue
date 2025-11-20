<script setup lang="ts">
const application = defineModel<CFS_GMP>({ required: true })
const languages = [
  { code: 'en', label: 'English' },
  { code: 'en-es', label: 'English + Spanish' },
  { code: 'en-ar', label: 'English + Arabic' }
]


const countryStore = useCountryStore()
const countryInfo = computed(() => {
  if (!application.value.country) return null
  if (!countryStore.dataMap.has(application.value.country)) return null
  return countryStore.dataMap.get(application.value.country)
})

</script>

<template>
  <v-card class="mt-4">
    <v-card-title>Certificate Details</v-card-title>
    <v-card-text class="flex flex-col gap-3">
      <country-selector :country="application.country"
                        error=""
                        label="Destination Country"
                        @set="(c: string) => (application.country = c)" />

      <v-select v-model="application.language"
                :items="languages"
                item-value="code"
                item-title="label"
                label="Language"
                density="compact" />

      <v-text-field v-model="application.copies"
                    type="number"
                    label="Number of Copies"
                    min="1"
                    max="10"
                    density="compact"
                    hint="Each copy receives a unique certificate number and is considered an official original."
                    persistent-hint />

      <v-checkbox v-model="application.authentication"
                  :label="`Do you want your document to be authenticated (${countryInfo?.authenticationType})?`"
                  density="compact"
                  hint="Authentication may be required for certain countries to verify the legitimacy of the document."
                  persistent-hint>
        <template #append>
          <field-info field="authentication" />
        </template>
      </v-checkbox>

      <v-checkbox v-model="application.hasAddendum"
                  label="Special wording"
                  hint="Request Custom Wording for Certificate Addendum?"
                  persistent-hint
                  density="compact">
        <template #append>
          <field-info field="addendum" />
        </template>
      </v-checkbox>

      <v-textarea v-model="application.addendum"
                  v-if="application.hasAddendum"
                  label="Addendum"
                  rows="3"
                  auto-grow
                  density="compact"
                  hint="Addendum wording may be adjusted or declined at the discretion of the Chamber of Commerce."
                  persistent-hint />

    </v-card-text>
  </v-card>

</template>

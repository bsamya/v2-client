<script setup lang="ts">
import CountryFlag from 'vue-country-flag-next'

const props = withDefaults(defineProps<{
  country?: string | null
  error?: string
  label?: string
}>(), {
  country: '' // normalize at runtime; avoids "got Null" warning
})

const emit = defineEmits<{
  (e: 'set', value: string): void
  (e: 'clear'): void
}>()

const country = useCountryStore()

// local model: always a string ('' when null/undefined)
const countryRef = ref<string>(props.country ?? '')

// keep local model in sync if parent changes prop to null later
watch(() => props.country, (v) => {
  countryRef.value = v ?? ''
})

const updateCountry = (val: string | null) => {
  const normalized = val ?? ''
  countryRef.value = normalized
  emit('set', normalized)
}

const clearCountry = () => {
  updateCountry('')
  emit('clear')
}
</script>

<template>
  <v-autocomplete v-model="countryRef"
                  :items="country.data"
                  :label="label"
                  :error-messages="props.error"
                  clearable
                  @update:modelValue="updateCountry"
                  @click:clear="clearCountry">
    <template #selection="{ item }">
      <v-list-item class="flex items-center gap-2"
                   :title="country.dataMap.get(item.value)?.title">
        <template #prepend>
          <CountryFlag v-if="item?.value"
                       :country="String(item.value).toLowerCase()" />
        </template>
      </v-list-item>
    </template>

    <template #item="{ item, props: slotProps }">
      <v-list-item class="flex items-center gap-2"
                   :title="country.dataMap.get(item.value)?.title"
                   v-bind="slotProps"
                   :error-message="props.error">
        <template #prepend>
          <CountryFlag v-if="item?.value"
                       :country="String(item.value).toLowerCase()" />
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

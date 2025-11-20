<template>
  <div>

    <v-select id="lang"
              v-model="locale"
              :items="availableLocales"
              hide-details
              density="compact">
    </v-select>


  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const { $i18n } = useNuxtApp()
const locale = ref($i18n.locale.value)

const availableLocales = computed(() => {
  return $i18n.availableLocales.filter(i => i !== locale.value)
})


watch(locale, (newLocale) => {
  $i18n.setLocale(locale.value)
})
</script>
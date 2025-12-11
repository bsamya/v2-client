<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  v: any   // Vuelidate field object
}>()

const state = computed(() => {
  if (props.v.$error) return 'error'
  if (props.v.$dirty) return 'valid'
  return 'untouched'
})
</script>

<template>
  <!-- ❗ Error (Shield Alert) -->
  <v-icon v-if="state === 'error'"
          icon="mdi-alert-circle-outline"
          color="error"
          size="20"
          class="mr-2" />

  <!-- ✔ Valid (Shield Check) -->
  <v-icon v-else-if="state === 'valid'"
          icon="mdi-check-circle-outline"
          color="light-green-darken-2"
          size="20"
          class="mr-2" />

  <!-- 🛡 Untouched (Shield Outline) -->
  <v-icon v-else
          icon="mdi-circle-outline"
          color="grey-lighten-1"
          size="20"
          class="mr-2" />
</template>

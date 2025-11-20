<template>
  <v-mask-input mask="phone"
                label="Mask input"></v-mask-input>

</template>
<script setup lang="ts">
import { ref } from 'vue'
import { vMaska } from 'maska/vue'

const phone = ref('')
</script>
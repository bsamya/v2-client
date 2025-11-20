<template>
  <div>
    <date-picker v-model="date"
                 label="Date"
                 hide-details
                 density="compact"></date-picker>
  </div>
</template>

<script setup lang="ts">
const date = ref("")
</script>

<style scoped></style>
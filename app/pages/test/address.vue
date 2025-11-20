<template>
  <div>
    <auto-complete label="Address"
                   v-model="address"
                   hide-details
                   density="compact"></auto-complete>
  </div>
</template>

<script setup lang="ts">
const address = ref('')
</script>

<style lang="scss" scoped></style>
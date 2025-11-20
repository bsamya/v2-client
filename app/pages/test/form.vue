<template>
  <div class="flex gap-4">
    <pre>{{ x }}</pre>
    <pre>{{ v$.$errors }}</pre>

  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, requiredIf } from "@vuelidate/validators";

const x = ref({ name: '' })
const requiredNameLength = ref(2)
const rules = computed(() => ({
  name: {
    required,
    minLength: minLength(requiredNameLength.value)
  },
}))

const v$ = useVuelidate(rules, x)

const validate = async () => {
  const isValid = await v$.value.$validate();
  console.clear();
  console.log("Validation result", isValid, v$.value.$errors);
  return isValid;
}

validate();
</script>

<style scoped></style>
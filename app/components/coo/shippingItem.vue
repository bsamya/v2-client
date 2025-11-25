<template>

  <v-alert variant="outlined"
           class="mb-4"
           border="start"
           :border-color="alert.color">

    <template #prepend>
      <v-icon :color="alert.color"
              :icon="alert.icon" />


    </template>
    <div class="grid grid-cols-8 gap-2">
      <v-textarea v-model.trim="shippingItem.description"
                  label="Description"
                  class="col-span-6"
                  auto-grow
                  rows="1"
                  clearable
                  counter
                  density="compact"
                  :error-messages="errors.description"
                  @blur="v$.description.$touch()" />

      <v-autocomplete v-model="shippingItem.countryOfOrigin"
                      :items="countryStore.data"
                      label="Country of Origin"
                      class="col-span-2"
                      multiple
                      chips
                      clearable
                      density="compact"
                      :error-messages="errors.countryOfOrigin"
                      @blur="v$.countryOfOrigin.$touch()" />

      <v-text-field v-model="shippingItem.grossWeight"
                    label="Gross Weight *"
                    class="col-span-2"
                    density="compact"
                    hide-details
                    :error-messages="errors.grossWeight"
                    @blur="v$.grossWeight.$touch()" />

      <v-text-field v-model="shippingItem.netWeight"
                    label="Net Weight"
                    class="col-span-2"
                    density="compact"
                    hide-details />

      <v-text-field v-model="shippingItem.hsCode"
                    label="HS Code"
                    class="col-span-2"
                    density="compact"
                    hide-details />

      <v-text-field v-model="shippingItem.marksAndNumbers"
                    label="Marks and Numbers"
                    class="col-span-2"
                    density="compact"
                    hide-details />

      <!-- Row actions -->
      <div class="col-span-8 flex justify-end gap-2">
        <v-btn size="x-small"
               variant="text"
               prepend-icon="mdi-content-copy"
               @click.prevent="$emit('copy')">
          Copy
        </v-btn>
        <v-btn size="x-small"
               variant="text"
               color="error"
               prepend-icon="mdi-delete"
               @click.prevent="$emit('delete')">
          Delete
        </v-btn>
      </div>


    </div>
  </v-alert>
</template>

<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

const shippingItem = defineModel<COOShippingItem>({ required: true });
const emit = defineEmits<{
  (e: 'copy'): void;
  (e: 'delete'): void;
}>();
const countryStore = useCountryStore();
const rules = {
  description: { required: helpers.withMessage("Required", required) },
  grossWeight: { required: helpers.withMessage("Required", required) },
  countryOfOrigin: { required: helpers.withMessage("Required", required) },
};

const v$ = useVuelidate(rules, shippingItem);
const errors = computed(() => {
  return validationErrors(v$.value);
});


const alert = computed(() => {
  if (v$.value.$error) {
    return { color: 'error', icon: 'mdi-alert-circle' }
    // ❌ invalid
  }

  if (v$.value.$dirty && !v$.value.$invalid) {
    return { color: 'success', icon: 'mdi-check-circle' }        // ✅ valid
  }

  return { color: 'info', icon: undefined }             // ⭕ not touched / pristine
})

// Expose validity state to parent

</script>

<style lang="scss" scoped></style>
<template>
  <v-card-text class="grid grid-cols-8 gap-2">
    <v-textarea v-model.trim="shippingItem.description"
                label="Description"
                class="col-span-6"
                auto-grow
                rows="1"
                clearable
                counter
                density="compact"
                :error-messages="v$.description.$errors.map(e => e.$message as string)"
                @blur="v$.description.$touch()" />

    <v-autocomplete v-model="shippingItem.countryOfOrigin"
                    :items="countryStore.data"
                    label="Country of Origin"
                    class="col-span-2"
                    multiple
                    chips
                    clearable
                    density="compact"
                    :error-messages="v$.countryOfOrigin.$errors.map(e => e.$message as string)"
                    @blur="v$.countryOfOrigin.$touch()" />

    <v-text-field v-model="shippingItem.grossWeight"
                  label="Gross Weight *"
                  class="col-span-2"
                  density="compact"
                  hide-details
                  :error-messages="v$.grossWeight.$errors.map(e => e.$message as string)"
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

    <!-- 
										-->

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


  </v-card-text>

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
  description: { required: helpers.withMessage("Description is required", required) },
  grossWeight: { required: helpers.withMessage("Gross Weight is required", required) },
  countryOfOrigin: { required: helpers.withMessage("Country of Origin is required", required) },
};

const v$ = useVuelidate(rules, shippingItem);
</script>

<style lang="scss" scoped></style>
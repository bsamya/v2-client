<template>
  <div>

    <div class="bg-white">
      <v-toolbar color="primary">
        <v-toolbar-title>Product</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon
               @click="$emit('close')"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <div class="p-6">
        <v-form @submit.prevent="submit">
          <v-text-field v-model="product.name"
                        label="Product Name *"
                        color="primary"
                        :error-messages="v$.name.$errors.map(e => e.$message as string)"></v-text-field>
          <v-text-field v-model="product.hsCode"
                        label="HS Code"
                        color="primary" />


          <v-select v-model="product.tags"
                    multiple
                    :items="availableTags"
                    label="Tags"
                    color="primary"
                    chips
                    clearable />
          <v-btn type="submit"
                 color="primary"
                 rounded
                 block
                 prepend-icon="mdi-content-save"
                 text="Save" />
        </v-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
const productStore = useProductStore();
const { product, availableTags } = storeToRefs(productStore);
const { setProduct } = productStore;

const emit = defineEmits(["close"]);

const rules = {
  name: {
    required: required,
    minLength: minLength(3),
    maxLength: maxLength(50),
  }
}
const v$ = useVuelidate(rules, productStore.product);

async function submit() {
  const result = await v$.value.$validate();
  if (!result) return;

  if (product.value.productId === "") {
    //new product
    product.value.productId = crypto.randomUUID();
  }
  setProduct()
    .then(() => {
      emit("close");
    });
}
</script>
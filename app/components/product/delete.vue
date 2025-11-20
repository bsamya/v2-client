<template>
  <v-alert type="error"
           title="Delete products"
           prominent>
    <p>Are you sure you want to delete the selected products?</p>

    <v-form @submit.prevent="submit">
      <p class="mt-4">
        <v-spacer />
        <v-btn variant="text"
               @click="$emit('close')"
               text="Cancel" />

        <v-btn variant="outlined"
               type="submit"
               text="Delete" />
        <v-spacer />
      </p>
    </v-form>
  </v-alert>

  <v-snackbar v-model="snackbar"
              timeout="10000"
              location="top end">
    Products deleted successfully.
  </v-snackbar>
</template>

<script setup lang="ts">
const { deleteSelectedProducts } = useProductStore();
const snackbar = ref(false);
const emit = defineEmits(['close']);
async function submit() {
  await deleteSelectedProducts()
    .then(() => {
      snackbar.value = true;
    })
    .finally(() => {
      emit('close');
    });
}
</script>

<template>
  <v-card min-width="250">
    <template #title>
      <span class="text-subtitle-2 font-weight-bold">
        Filters
      </span>
    </template>

    <template #append>
      <v-btn icon
             @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>

    <v-divider />

    <v-card-text>
      <v-chip-group v-model="productTagFilters"
                    multiple
                    column>
        <v-chip v-for="tag in availableTags"
                :key="tag"
                :value="tag"
                variant="outlined">
          <template #prepend>
            <v-icon class="mr-2"
                    :color="productTagFilters.includes(tag) ? 'primary' : 'grey'">
              {{ productTagFilters.includes(tag)
                ? 'mdi-check-circle'
                : 'mdi-circle-outline' }}
            </v-icon>
          </template>
          {{ tag }}
        </v-chip>
      </v-chip-group>
    </v-card-text>

    <v-divider />

    <v-card-actions class="justify-end">
      <span>
        {{ filteredProducts.length }}
        {{ filteredProducts.length > 1 ? 'Products' : 'Product' }} shown
      </span>
      <v-spacer />
      <v-btn variant="flat"
             color="red"
             rounded
             @click="productTagFilters = []">
        Clear
      </v-btn>
    </v-card-actions>
  </v-card></template>

<script setup lang="ts">
const emits = defineEmits(['close']);
const productStore = useProductStore();
const { filteredProducts, availableTags, productTagFilters } = storeToRefs(productStore);

</script>

<style scoped></style>
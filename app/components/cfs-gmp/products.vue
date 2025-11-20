<template>
  <v-card class="mt-4">
    <v-toolbar color="info">
      <template #prepend>
        <div class="flex gap-2 mx-2 items-center">
          <v-icon size="48">mdi-database</v-icon>
          Products
        </div>
      </template>

      <v-text-field v-model="search"
                    prepend-inner-icon="mdi-magnify"
                    label="Search Products"
                    clearable
                    rounded
                    hide-details
                    density="comfortable" />

      <v-spacer />

      <div class="flex gap-3">
        <!-- Filter by tag -->
        <v-btn variant="text"
               class="flex-column"
               stacked>
          <v-badge location="top right"
                   :color="tagColor"
                   dot>
            <v-icon icon="mdi-filter" />
          </v-badge>

          <span class="text-caption mt-1">Filter by tag</span>

          <v-overlay v-model="overlay.filters"
                     activator="parent"
                     location-strategy="connected"
                     location="bottom center"
                     :disabled="data.length === 0"
                     :close-on-content-click="false"
                     max-width="300"
                     transition="scale-transition">
            <lazy-product-filter @close="overlay.filters = false" />
          </v-overlay>
        </v-btn>

        <!-- Add product -->
        <v-btn variant="text"
               class="flex-column"
               stacked
               @click="
                () => {
                  addProduct()
                  overlay.product = true
                }
              ">
          <v-icon size="24">mdi-database-plus</v-icon>
          <span class="text-caption mt-1">Add</span>

          <v-dialog v-model="overlay.product"
                    activator="parent"
                    max-width="400">
            <lazy-product-form :key="product.productId"
                               @close="overlay.product = false" />
          </v-dialog>
        </v-btn>
      </div>
    </v-toolbar>

    <v-data-table-virtual :items="filteredProducts"
                          :headers="headers"
                          :search="search"
                          show-select
                          item-value="productId"
                          v-model="application.products"
                          density="compact"
                          height="600">

      <template #item.tags="{ item }">
        <v-chip v-for="(tag, index) in item.tags"
                :key="index"
                class="ma-1"
                size="small"
                text-color="white"
                :text="tag" />

      </template>
    </v-data-table-virtual>
  </v-card>
</template>

<script setup lang="ts">
const application = defineModel<CFS_GMP>({ required: true })
const productStore = useProductStore()
const { filteredProducts, product, tagColor } = storeToRefs(productStore)
const { addProduct, data } = productStore
const headers = [
  { title: 'Product Name', key: 'name' },
  { title: 'Tags', key: 'tags' }
]

const search = ref<string>('')

const overlay = reactive({
  filters: false,
  product: false
})

</script>

<style scoped></style>
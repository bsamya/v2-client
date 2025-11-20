<template>
  <v-container>

    <v-card elevation="4">
      <v-toolbar color="info">
        <template #prepend>
          <div class="flex gap-2 mx-2 items-center">
            <v-icon size="48">mdi-database</v-icon> Products
          </div>
        </template>
        <!-- Search -->
        <v-text-field v-model="search"
                      prepend-inner-icon="mdi-magnify"
                      label="Search Products"
                      clearable
                      rounded
                      hide-details
                      density="comfortable" />

        <v-spacer />

        <!-- Actions -->
        <div class="flex gap-3">
          <!-- Tag / Untag -->
          <v-btn variant="text"
                 class="flex-column"
                 stacked
                 :disabled="selectedProducts.length === 0">
            <v-icon size="24">mdi-tag-multiple</v-icon>
            <span class="text-caption mt-1">Manage Tags</span>

            <v-dialog v-model="overlay.addRemoveTags"
                      width="300"
                      activator="parent"
                      location-strategy="connected"
                      location="bottom center">

              <lazy-product-tag-set-unset @close="overlay.addRemoveTags = false" />
            </v-dialog>
          </v-btn>

          <!-- Create Tag -->
          <v-btn variant="text"
                 class="flex-column"
                 stacked>
            <v-icon size="24">mdi-tag-plus</v-icon>
            <span class="text-caption mt-1">New Tag</span>
            <v-overlay v-model="overlay.createTag"
                       location-strategy="connected"
                       location="bottom center"
                       activator="parent"
                       width="300">
              <lazy-product-tag-new @close="overlay.createTag = false" />

            </v-overlay>
          </v-btn>



          <!-- filter Product by  tags-->
          <v-btn variant="text"
                 class="flex-column"
                 stacked>
            <v-badge location="top right"
                     :color="tagColor"
                     dot>
              <v-icon icon="mdi-filter"></v-icon>
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


          <!-- Add product-->
          <v-btn variant="text"
                 class="flex-column"
                 stacked
                 @click="addProduct">
            <v-icon size="24">mdi-database-plus</v-icon>
            <span class="text-caption mt-1">Add</span>

            <v-dialog v-model="overlay.product"
                      activator="parent"
                      max-width="400">
              <lazy-product-form :key="product.productId"
                                 @close="overlay.product = false" />

            </v-dialog>
          </v-btn>

          <!-- Delete -->
          <v-btn variant="text"
                 class="flex-column"
                 stacked
                 :disabled="selectedProducts.length === 0">
            <v-icon size="24">mdi-database-remove</v-icon>
            <span class="text-caption mt-1">Delete</span>
            <v-dialog v-model="overlay.remove"
                      activator="parent"
                      max-width="500">
              <lazy-product-delete @close="overlay.remove = false" />
            </v-dialog>

          </v-btn>


          <!-- Import -->
          <v-btn variant="text"
                 class="flex-column"
                 stacked>
            <v-icon size="24">mdi-database-import</v-icon>
            <span class="text-caption mt-1">Import</span>
          </v-btn>
        </div>
      </v-toolbar>

      <v-card-text>
        <v-data-table-virtual :headers="headers"
                              :items="filteredProducts"
                              :search="search"
                              height="400"
                              show-select
                              item-value="productId"
                              v-model="selectedProducts"
                              hover>

          <template #item.tags="{ item }">
            <div class="flex flex-wrap gap-2 mx-2">
              <v-chip v-for="tag in item.tags"
                      :key="tag"
                      small
                      variant="outlined">
                {{ tag }}
              </v-chip>
            </div>
          </template>

          <template #item.actions="{ item }">
            <v-btn variant="text"
                   size="small"
                   @click="() => { editProduct(item); overlay.product = true }">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

          </template>

        </v-data-table-virtual>

        <p class="mt-8">{{ filteredProducts.length }} {{ filteredProducts.length > 1 ? 'Products' :
          "Product" }}
        </p>

      </v-card-text>
    </v-card>


    <pre>{{ selectedProducts }}</pre>
  </v-container>

  <v-dialog v-model="dialog"
            width="600">
    <product-upload-csv @close="dialog = false" />
  </v-dialog>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Products",
});

//table headers
const headers = [
  {
    key: "name",
    title: "Product Name",
  },
  {
    key: "tags",
    title: "Tags",
  },
  {
    title: "",
    key: "actions",
    width: "100",
    sortable: false,

  }
];

const search = ref("");
const dialog = ref(false);
const productStore = useProductStore()
const { data, filteredProducts, tagColor, selectedProducts, product } = storeToRefs(productStore);
const { editProduct, addProduct } = productStore;




const overlay = ref({
  addRemoveTags: false,
  createTag: false,
  filters: false,
  product: false,
  remove: false,
});






</script>
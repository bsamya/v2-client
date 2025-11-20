<template>
  <v-card min-width="250">
    <template #title>
      <span class="text-subtitle-2 font-weight-bold">
        Select tags to add or remove
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
      <v-chip-group v-model="selectedTags"
                    multiple
                    column>
        <v-chip v-for="tag in availableTags"
                variant="outlined"
                :color="selectedTags.includes(tag) ? 'primary' : ''"
                :value="tag"
                :key="tag">
          <template #prepend>
            <v-icon class="mr-2">
              {{ selectedTags.includes(tag) ? 'mdi-check-circle' : 'mdi-circle-outline' }}
            </v-icon>
          </template>
          {{ tag }}</v-chip>
      </v-chip-group>

    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn variant="flat"
             color="primary"
             prepend-icon="mdi-tag-plus"
             @click="tag().then(() => $emit('close'))">Tag</v-btn>
      <v-btn variant="flat"
             color="error"
             prepend-icon="mdi-tag-remove"
             @click="untag().then(() => $emit('close'))">Untag</v-btn>
    </v-card-actions>

  </v-card>
</template>

<script setup lang="ts">
const productStore = useProductStore();
const { tag, untag } = useProductStore();
const { availableTags, selectedTags } = storeToRefs(productStore);

const emits = defineEmits(['close']);
</script>

<style lang="scss" scoped></style>
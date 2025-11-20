<template>
  <v-card min-width="250"
          @click:append="$emit('close')"
          @click:append-icon="$emit('close')">


    <template #append>
      <v-btn icon
             @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>

    <template #title>
      <span class="text-subtitle-2 font-weight-bold">
        New Tag
      </span>
    </template>

    <v-divider />
    <v-card-text>
      <v-text-field v-model="tagName"
                    label="Tag Name"
                    density="compact"
                    hide-details
                    prepend-inner-icon="mdi-tag-plus">

        <template #append>

          <v-btn variant="flat"
                 color="primary"
                 block
                 size="small"
                 @click="newTag">Create</v-btn>
        </template>
      </v-text-field>
    </v-card-text>
  </v-card>

</template>

<script setup lang="ts">
const emits = defineEmits(['close']);
const productStore = useProductStore();
const { setTag } = useProductStore();
const { availableTags } = storeToRefs(productStore);
const tagName = ref("");

function newTag() {
  if (tagName.value && !availableTags.value.includes(tagName.value)) {
    setTag(tagName.value)
      .then(() => {
        tagName.value = "";
        emits('close')
      })
  }
}
</script>
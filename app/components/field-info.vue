<script setup lang="ts">
const props = defineProps<{ field: 'addendum' | 'authentication' }>()


const fieldMap = {
  addendum: {
    title: 'Addendum Information',
    content: 'Addendum information'
  },
  authentication: {
    title: 'Authentication Information',
    content: 'Authentication information'
  }
}
</script>
<template>
  <div>
    <v-icon icon="mdi-information"
            size="24"
            class="ml-2" />
    <v-overlay activator="parent"
               location-strategy="connected"
               :offset="[0, 10]"
               max-width="600"
               location="left">
      <v-card :title="fieldMap[props.field].title"
              class="pa-4">
        <v-card-text>

          {{ fieldMap[props.field].content }}
        </v-card-text>
      </v-card>
    </v-overlay>
  </div>

</template>


<style scoped></style>
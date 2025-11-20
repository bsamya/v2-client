<template>
  <v-form ref="form"
          class="p-4 max-w-xl mx-auto flex flex-col gap-4">
    <GoogleAddressField v-model="companyAddress"
                        :api-key="googleApiKey"
                        :required="true"
                        :component-restrictions="{ country: ['us'] }"
                        @place-selected="place => rawPlace = place" />

    <v-btn color="primary"
           @click="submit">Submit</v-btn>

    <pre class="mt-4 text-caption">
{{ JSON.stringify(companyAddress, null, 2) }}
    </pre>
  </v-form>
</template>

<script setup lang="ts">

export interface AddressResult {
  formatted_address: string
  unit: string
  address: string
  city: string
  state: string
  zip: string
}


const companyAddress = ref<AddressResult | null>(null)
const rawPlace = ref<any | null>(null)
const googleApiKey = 'YOUR_GOOGLE_API_KEY'

async function submit() {
  console.log('Structured address:', companyAddress.value)
}
</script>

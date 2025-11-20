<script setup lang="ts">
const id = crypto.randomUUID();

//models
const address = defineModel<string>("address");
address.value = address.value ?? '';

const isValid = defineModel<boolean>("isValid");
isValid.value = isValid.value ?? true;

//props
const props = defineProps({
  "label": {
    type: String,
    default: 'Enter an address',
  },

  errorMessages: {
    type: String,
    default: '',
  },
});

function clearInput() {
  address.value = '';
  isValid.value = true;
}

onMounted(async () => {
  // Wait for DOM to paint to ensure the input exists
  await nextTick()

  // Option A: grab the real input by id (simplest & robust)
  const el = document.getElementById(id) as HTMLInputElement | null

  //set autocomplete options
  var options = {
    //bounds: defaultBounds,
    //types: ['establishment']
    componentRestrictions: { country: ["us"] },
    fields: ["address_components", "formatted_address"],
  };

  //@ts-ignore
  let autocomplete = new google.maps.places.Autocomplete(el, options);
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    address.value = place.formatted_address || '';
    isValid.value = true;
  });

});
</script>

<template>
  <div>
    <v-text-field :id="id"
                  :label="props.label"
                  :error-messages="props.errorMessages"
                  @input="isValid = false"
                  @click:clear="clearInput"
                  v-model="address"
                  outlined
                  clearable />
  </div>
</template>

<style>
.pac-container {
  z-index: 9999 !important;
}

.pac-item {
  cursor: pointer;
  padding: 6px;
}

.pac-item:hover {
  background-color: #7bb4f5;
}
</style>
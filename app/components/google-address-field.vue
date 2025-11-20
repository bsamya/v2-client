<template>
  <div class="flex  gap-3">


    <!-- Address (Google Autocomplete) -->
    <v-text-field ref="textField"
                  v-model="localAddress"
                  label="Street Address"
                  placeholder="Start typing your address..."
                  :rules="rules"
                  clearable
                  prepend-inner-icon="mdi-map-marker"
                  @click:clear="onClear" />

    <!-- Optional Unit / Apt -->
    <v-text-field v-model="unit"
                  label="Unit / Apt #"
                  placeholder="Optional"
                  clearable />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
declare const google: any

// 🧩 Types
export interface AddressResult {
  formatted_address: string
  unit: string
  address: string    // includes unit if present
  city: string
  state: string
  zip: string
}

// 🧩 Props
const props = defineProps<{
  modelValue: AddressResult | null
  apiKey: string
  required?: boolean
  componentRestrictions?: { country: string | string[] }
}>()

// 🧩 Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: AddressResult | null): void
  (e: 'place-selected', place: any): void
}>()

const textField = ref<any>(null)
const localAddress = ref('')
const selectedPlace = ref<any | null>(null)
const unit = ref('')
const company = ref('')
const contactName = ref('')
let autocomplete: any | null = null

// 🔍 Validation (require a real place if required)
const rules = computed(() => [
  () =>
    !props.required ||
    !!selectedPlace.value?.place_id ||
    'Please select an address from the suggestions.'
])

// 🧠 Load Google Maps JS API
async function loadGoogleScript(apiKey: string) {
  if (typeof window === 'undefined') return
  if ((window as any).google?.maps?.places) return

  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = reject
    document.head.appendChild(s)
  })
}

// 📦 Parse Google place into structured US address + geo
function parseAddress(place: any): AddressResult {
  const components: Record<string, string> = {}

  if (Array.isArray(place.address_components)) {
    for (const c of place.address_components) {
      const type = c.types[0]
      components[type] = c.short_name
    }
  }

  const streetNumber = components['street_number'] || ''
  const route = components['route'] || ''
  const city =
    components['locality'] ||
    components['sublocality'] ||
    components['administrative_area_level_2'] ||
    ''
  const state = components['administrative_area_level_1'] || ''
  const zip = components['postal_code'] || ''
  const address = [streetNumber, route].filter(Boolean).join(' ')

  return {
    formatted_address: place.formatted_address,
    unit: unit.value.trim(),
    address,
    city,
    state,
    zip,

  }
}


// 🧩 Initialize Autocomplete
function initAutocomplete() {
  const input = (textField.value?.$el as HTMLElement)
    .querySelector('input') as HTMLInputElement | null

  if (!input || !(window as any).google?.maps?.places) return

  const opts: any = { types: ['address'] }
  if (props.componentRestrictions) {
    opts.componentRestrictions = props.componentRestrictions
  }

  autocomplete = new google.maps.places.Autocomplete(input, opts)

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    selectedPlace.value = place
    localAddress.value = place?.formatted_address || input.value || ''
    const structured = parseAddress(place)
    emit('update:modelValue', structured)
    emit('place-selected', place)
  })
}

// 🧹 Clear everything
function onClear() {
  localAddress.value = ''
  unit.value = ''
  selectedPlace.value = null
  emit('update:modelValue', null)
}

// 🚀 Mount
onMounted(async () => {
  if (!props.apiKey) {
    console.warn('[GoogleAddressField] Missing apiKey')
    return
  }
  try {
    await loadGoogleScript(props.apiKey)
    initAutocomplete()
  } catch (e) {
    console.error('[GoogleAddressField] Failed to load Google API', e)
  }
})



</script>

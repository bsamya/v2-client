<template>
  <div>
    <v-text-field :label="props.label"
                  :id="id"
                  :error-messages="props.errorMessages"
                  clearable
                  append-inner-icon="mdi-calendar"
                  v-model="dateInput" />

  </div>
</template>

<script setup lang="ts">
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { useDate } from 'vuetify'
const dateFns = useDate();


const dateInput = defineModel<string>({
  required: true,
  default: '',
  type: String,
});


//validate date input
if (dateInput.value !== '' && !dateFns.isValid(dateInput.value)) {
  dateInput.value = ''; // Reset to empty if invalid
  console.error("Invalid date input:", dateInput.value);
}


const props = defineProps({
  label: {
    type: String,
    default: 'Select a date'
  },
  errorMessages: {
    type: String,
    default: ''
  }
});

const id = crypto.randomUUID(); // Generate a unique ID for the date picker


//@ts-ignore
let fp = null;
onMounted(async () => {
  await nextTick();

  try {
    //console.log("Initializing flatpickr with ID:", id, props.label);
    const el = document.getElementById(id);
    if (!el) {
      console.error("Element with ID not found:", id);
      return;
    }

    // Initialize flatpickr on the date input  
    fp = flatpickr(el, {
      minDate: "today",
      onChange: function (selectedDates, dateStr) {
        //console.log("Selected date:", dateStr);
        dateInput.value = dateStr;
      },
    });
  }
  catch (error) {
    console.error("Error initializing flatpickr:", error);
  }
});

onUnmounted(() => {
  //console.log("Cleaning up flatpickr instance for ID:", id);
  //@ts-ignore
  fp.destroy(); // Clean up flatpickr instance on unmount
});


</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="modelValue"
    transition="dialog-top-transition"
    width="auto"
  >
    <v-card>
      <v-date-picker v-model="datePicker" color="green lighten-1" readonly></v-date-picker>
    </v-card>
    <v-btn @click="closeDialog">Close</v-btn>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { VDatePicker } from "vuetify/lib/labs/components.mjs";
const { modelValue, formattedDate } = defineProps({
  modelValue: Boolean,
  formattedDate: String,
});

const datePicker = ref(new Date().toISOString().substr(0, 10));
const emits = defineEmits(["close-dialog"]);

const adjustTheDate = computed(() => {
  if (!datePicker.value) return "";

  const selectedDate = new Date(datePicker.value);
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
});

function closeDialog() {
  emits("close-dialog", false, adjustTheDate.value);
}
</script>

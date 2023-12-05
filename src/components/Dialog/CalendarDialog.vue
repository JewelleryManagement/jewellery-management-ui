<template>
  <v-dialog
    :model-value="props.modelValue"
    @update:model-value="props.modelValue"
    transition="dialog-top-transition"
    width="auto"
  >
    <v-card>
      <v-date-picker
        v-model="datePicker"
        color="green lighten-1"
        @update:model-value="closeDialog"
        @click:cancel="closeDialog"
      ></v-date-picker>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { VDatePicker } from "vuetify/lib/labs/components.mjs";
const props = defineProps({
  modelValue: Boolean,
});
import { dateFormatter } from "@/utils/data-formatter";

const datePicker = ref(new Date().toISOString().substr(0, 10));
const emits = defineEmits(["close-dialog"]);

const formattedDate = computed(() => {
  if (!datePicker.value) return "";
  return dateFormatter(datePicker.value);
});

function closeDialog() {
  emits("close-dialog", formattedDate.value);
}
</script>

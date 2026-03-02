<template>
  <v-dialog
    :model-value="props.modelValue"
    @update:model-value="props.modelValue"
    transition="dialog-top-transition"
    width="auto"
    @click:outside="closeDialog"
  >
    <v-card>
      <v-date-picker
        v-model="datePicker"
        color="green lighten-1"
        :max="maxDate"
        @update:model-value="closeDialog"
        @click:cancel="closeDialog"
      ></v-date-picker>

      <v-text-field :model-value="time" label="Time" readonly>
        <v-menu
          v-model="showMenu"
          :close-on-content-click="false"
          activator="parent"
          min-width="0"
        >
          <v-time-picker v-model="time" format="24hr"></v-time-picker>
        </v-menu>
      </v-text-field>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
const props = defineProps({
  modelValue: Boolean,
});
import { dateFormatter } from "@/utils/data-formatter";
import { watch } from "vue";

const time = ref(null);

const setCurrentTime = () =>
  (time.value = new Date().toTimeString().slice(0, 5));

watch(
  () => props.modelValue,
  () => setCurrentTime(),
);

const showMenu = ref(false);

const maxDate = new Date();
const datePicker = ref(new Date());
const emits = defineEmits(["close-dialog"]);

const formattedDate = computed(() => {
  if (!datePicker.value) return "";
  const formatted = dateFormatter(datePicker.value);
  return `${formatted} ${time.value}`;
});

function closeDialog() {
  emits("close-dialog", formattedDate.value);
}
</script>

<template>
  <div>
    <p v-if="formattedDate" class="mt-2 mx-auto text-center">
      Selected date: {{ formattedDate }}
    </p>

    <calendar-dialog
      :model-value="props.calendarDialog"
      @update:model-value="props.calendarDialog"
      @click:outside="() => emits('close-dialog', selectedDate)"
      @close-dialog="handleCloseCalendar"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { CalendarDialog } from "@/components";

const props = defineProps({ calendarDialog: Boolean, sellObject: Object });
const emits = defineEmits(["close-dialog"]);

const formattedDate = ref("");

watch(() => props.sellObject.date, (newValue) => {
  formattedDate.value = newValue;
});

function handleCloseCalendar(selectedDate) {
  if (!selectedDate) return;
  formattedDate.value = selectedDate
  props.sellObject.date = selectedDate;
  emits('close-dialog')
}
</script>

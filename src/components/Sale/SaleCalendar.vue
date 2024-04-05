<template>
  <div>
    <p v-if="formattedDate.length > 0" class="mt-2 mx-auto text-center">
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
import { ref } from "vue";
import CalendarDialog from "@/components/Dialog/CalendarDialog.vue";

const props = defineProps({ calendarDialog: Boolean });
const emits = defineEmits(["close-dialog"]);

const formattedDate = ref("");


function handleCloseCalendar(selectedDate) {
  if (!selectedDate) return;
  formattedDate.value = selectedDate;
  emits('close-dialog', selectedDate)
}

</script>

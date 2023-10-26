<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="modelValue"
    transition="dialog-top-transition"
    width="auto"
  >
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-toolbar color="red" title="Resource Content..."></v-toolbar>
        <v-card-text v-for="(resource, index) in resourceContent" :key="index">
          <div
            v-for="(resourceItem, header) in resource.resource"
            :key="header"
          >
            <template v-if="header !== 'id'">
              {{ header }} - {{ resourceItem }}
              <hr />
            </template>
          </div>
          Quantity: {{ resource.quantity }}
        </v-card-text>

        <v-card-actions class="justify-space-between">
          <v-btn
            color="red"
            variant="text"
            @click="() => $emit('close-dialog')"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
const { modelValue, data } = defineProps({
  modelValue: Boolean,
  data: Object,
});
const resourceContent = ref(data.resourcesContent);
</script>

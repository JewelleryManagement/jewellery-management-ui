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
        <v-card-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="tableColumnsResources"
          :items="tableData"
          :search="search"
        >
        </v-data-table>

        <v-card-actions class="justify-end">
          <v-btn color="red" variant="text" @click="() => $emit('close-dialog')"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
const { modelValue, data } = defineProps({
  modelValue: Boolean,
  data: Object,
});
const store = useStore();
const tableColumnsResources = computed(
  () => store.getters["resources/getColumnsWithQuantity"]
);
const search = ref("");

const resourceContent = ref(data.resourcesContent);
const tableData = resourceContent.value.map((item) => ({
  quantity: item.quantity,
  ...item.resource,
}));
</script>

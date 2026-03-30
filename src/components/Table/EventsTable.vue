<template>
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
    :headers="headers"
    :items="items"
    :search="search"
    @click:row="navigateToItemPage"
    hover
  >
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>

    <template v-slot:item.timestamp="{ item }">
      {{ new Date(item.timestamp).toLocaleString("en-GB") }}
    </template>

    <template v-slot:item.type="{ item }">
      {{ eventTypes[item.type].title }}
    </template>

    <template v-slot:item.executor="{ item }">
      <user-tool-tip :user="item.executor" @click.stop />
    </template>
  </v-data-table>
</template>

<script setup>
import { ref, computed } from "vue";
import UserToolTip from "../Tooltip/UserToolTip.vue";
import { navigateToItemDetails } from "@/utils/row-click-handler";
import { useRouter } from "vue-router";
import { useSystemEventsStore } from "@/store/systemEvents";

const props = defineProps({
  headers: Array,
  items: Array,
});

const search = ref("");
const systemEventsStore = useSystemEventsStore();
const router = useRouter();

const eventTypes = computed(() => systemEventsStore.eventTypes);

const navigateToItemPage = (row, item) => {
  const eventId = item.internalItem.key;

  navigateToItemDetails(router, "Event-Details", "eventId", eventId);
};
</script>

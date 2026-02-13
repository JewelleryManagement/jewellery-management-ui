<template>
  <div>
    <v-card class="mx-auto text-center mt-10 mb-10" width="800" elevation="6">
      <v-card-title class="position-relative text-center">
        <v-chip
          class="position-absolute left-0 mt-1"
          style="margin-left: 110px"
          :color="color"
          variant="flat"
          size="small"
        >
          {{ eventTypes[event.type].type }}
        </v-chip>

        <span class="mx-auto">
          {{ eventTypes[event.type].title }}
        </span>
      </v-card-title>

      <v-card-text>
        <v-row dense>
          <v-col cols="4" class="text-medium-emphasis"> Date: </v-col>
          <v-col cols="8">
            {{ `(${timeAgo(date)}) ${date}` }}
          </v-col>

          <v-col cols="4" class="text-medium-emphasis"> Executor: </v-col>
          <v-col cols="8">
            <user-tool-tip :user="event.executor" @click.stop />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <UpdatedEvent
      v-if="eventTypes[event.type].type === 'Update'"
      :event="event"
      :eventTypes="eventTypes"
    />

    <CreatedOrDeletedEvent v-else :event="event" :eventTypes="eventTypes" />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { computed } from "vue";
import CreatedOrDeletedEvent from "./CreatedOrDeletedEvent.vue";
import UserToolTip from "@/components/Tooltip/UserToolTip.vue";
import UpdatedEvent from "./UpdatedEvent.vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

const timeAgo = (input) => dayjs(input, "DD/MM/YYYY, HH:mm:ss", true).fromNow();

const route = useRoute();
const store = useStore();

const eventId = route.params.eventId;

const event = await store.dispatch("systemEvents/getSystemEvent", eventId);

const eventTypes = computed(() => store.getters["systemEvents/getEventTypes"]);

const date = new Date(event.timestamp).toLocaleString("en-GB");

const typeColorMap = {
  Create: "green",
  Update: "purple",
  Delete: "red",
};

const color = computed(
  () => typeColorMap[eventTypes.value[event.type].type] ?? "grey",
);
</script>

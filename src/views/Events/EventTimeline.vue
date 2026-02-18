<template>
  <div class="pt-2">
    <div class="position-relative mb-6">
      <div
        class="position-absolute me-4"
        style="right: 0; top: 50%; transform: translateY(-50%)"
      >
        <text-button
          color="blue"
          :text="horizontal ? 'Vertical View' : 'Horizontal View'"
          :prepend-icon="
            horizontal ? 'mdi-align-vertical-top' : 'mdi-align-horizontal-left'
          "
          @click="onDirectionClick"
        />
      </div>

      <div
        class="position-absolute ms-4"
        style="left: 0; top: 50%; transform: translateY(-50%)"
      >
        <text-button
          color="blue"
          :text="sideEnd ? 'Centered' : 'One-Side'"
          :prepend-icon="
            sideEnd ? 'mdi-format-align-center' : 'mdi-format-align-left'
          "
          @click="onSideEndClick"
        />
      </div>

      <div class="d-flex align-center justify-center">
        <v-icon size="45" class="me-2 text-medium-emphasis">
          mdi-calendar-clock
        </v-icon>

        <div class="text-center">
          <div class="text-h4 font-weight-medium">Activity History</div>
          <div class="text-body-1 text-medium-emphasis">
            System events and changes
          </div>
        </div>
      </div>
    </div>

    <div ref="scrollContainer" class="overflow-x-auto" @wheel="onWheel">
      <v-timeline
        class="pt-2"
        :direction="horizontal ? 'horizontal' : 'vertical'"
        :side="sideEnd ? 'end' : undefined"
      >
        <v-timeline-item
          v-for="event in props.events"
          :key="event.id"
          :dot-color="color(event)"
          :icon="eventTypes[event.type]?.icon"
          size="default"
          fill-dot
        >
          <v-card
            v-if="eventTypes[event.type]?.type"
            class="mx-auto my-3 cursor-pointer hover-scale"
            max-width="560"
            elevation="4"
            hover
            @click="navigateToDetailsPage(event)"
          >
            <v-card-title class="text-subtitle-1 font-weight-medium">
              {{ eventTypes[event.type]?.title }}
            </v-card-title>

            <v-card-subtitle class="text-high-emphasis">
              {{ date(event.timestamp) }} • {{ timeAgo(date(event.timestamp)) }}
            </v-card-subtitle>

            <v-card-text class="pt-2">
              <div class="d-flex align-center">
                <span class="text-medium-emphasis me-2">Executor:</span>
                <user-tool-tip :user="event.executor" @click.stop />
              </div>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";
import UserToolTip from "@/components/Tooltip/UserToolTip.vue";
import { useRouter } from "vue-router";
import { navigateToItemDetails } from "@/utils/row-click-handler";
import TextButton from "@/components/Button/TextButton.vue";

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
const timeAgo = (input) => dayjs(input, "DD/MM/YYYY, HH:mm:ss", true).fromNow();
const date = (timestamp) => new Date(timestamp).toLocaleString("en-GB");

const props = defineProps({
  events: Array,
});

const store = useStore();
const router = useRouter();
const eventTypes = computed(() => store.getters["systemEvents/getEventTypes"]);

const typeColorMap = computed(
  () => store.getters["systemEvents/getTypeColorMap"],
);
const color = (event) =>
  typeColorMap.value[eventTypes.value[event.type]?.type] ?? "grey";

const navigateToDetailsPage = (event) => {
  navigateToItemDetails(router, "Event-Details", "eventId", event.id);
};

const horizontal = ref(true);
const onDirectionClick = () => {
  horizontal.value = !horizontal.value;
};

const sideEnd = ref(true);
const onSideEndClick = () => {
  sideEnd.value = !sideEnd.value;
};

const scrollContainer = ref(null);
const onWheel = (e) => {
  if (!horizontal.value) return;

  scrollContainer.value.scrollLeft += e.deltaY;
  e.preventDefault();
};
</script>
<style>
.hover-scale {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}
</style>

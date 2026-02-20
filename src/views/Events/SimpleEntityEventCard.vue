<template>
  <v-card class="mx-auto mt-10 mb-10" width="800" elevation="6">
    <EventCardTitleWithRawInfoButton
      v-model:rawDataButton="rawDataButton"
      :title="title"
    />

    <v-card-text class="text-center">
      <pre
        v-if="rawDataButton"
        class="text-left text-body-2"
        style="white-space: pre-wrap; word-break: break-word"
        >{{ JSON.stringify(entity, null, 2) }}
      </pre>

      <template v-else>
        <template v-for="row in rows" :key="row.key">
          <div
            v-if="!row.align && row.key in (entity || {})"
            class="d-flex mb-2"
          >
            <span class="font-weight-medium me-2"> {{ row.title }}: </span>
            <span>
              {{ entity?.[row.key] ?? "" }}
            </span>
          </div>
        </template>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup>
import EventCardTitleWithRawInfoButton from "./EventCardTitleWithRawInfoButton.vue";
import { ref } from "vue";
const props = defineProps({
  entity: Object,
  title: String,
  rows: Array,
});

const rawDataButton = ref(false);
</script>

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
            v-if="
              !row.align &&
              (row.key in (entity || {}) ||
                row.key in (entity?.transferredResource || {}) ||
                row.key in (entity?.transferredResource?.resource || {}))
            "
            class="d-flex mb-2"
          >
            <span class="font-weight-medium me-2"> {{ row.title }}: </span>
            <span v-if="row.key === 'newOwner'">
              {{ entity?.newOwner.name ?? "" }}
            </span>
            <span v-if="row.key === 'previousOwner'">
              {{ entity?.previousOwner.name ?? "" }}
            </span>
            <span v-else-if="row.key === 'dealPrice'">
              {{ entity?.dealPrice ?? "" }}
            </span>
            <span v-else-if="row.key === 'quantity'">
              {{ entity?.transferredResource?.quantity ?? "" }}
            </span>
            <span v-else>
              {{ entity?.transferredResource?.resource?.[row.key] ?? "" }}
            </span>
          </div>
        </template>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import EventCardTitleWithRawInfoButton from "./EventCardTitleWithRawInfoButton.vue";
const props = defineProps({
  entity: Object,
  title: String,
});

const store = useStore();

const resourceRows = computed(
  () =>
    store.getters["resources/getColumnsByResource"]?.(
      props.entity?.transferredResource?.resource?.clazz,
      true,
    ) || [],
);

const additionalResourceRows = computed(
  () => store.getters["resources/getTableColumnsOrganizationTransfer"],
);

const rows = [...additionalResourceRows.value, ...resourceRows.value];

const rawDataButton = ref(false);
</script>

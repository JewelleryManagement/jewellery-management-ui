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
        <template v-for="row in userInOrganizationRows" :key="row.key">
          <div
            v-if="
              !row.align &&
              (row.key in (entity || {}) ||
                row.key in (entity?.member || {}) ||
                row.key in (entity?.member?.user || {}))
            "
            class="d-flex mb-2"
          >
            <span class="font-weight-medium me-2">{{ row.title }}:</span>

            <span v-if="row.key === 'organizationPermissions'">
              {{ entity?.member?.organizationPermissions ?? "" }}
            </span>

            <span v-if="row.key === 'organization'">
              {{ entity?.organization?.name ?? "" }}
            </span>

            <span v-else>
              {{ entity?.member?.user?.[row.key] ?? "" }}
            </span>
          </div>
        </template>
      </template>
    </v-card-text>
  </v-card>
</template>
<script setup>
import { computed, ref } from "vue";
import { useUsersStore } from "@/store/users";
import EventCardTitleWithRawInfoButton from "./EventCardTitleWithRawInfoButton.vue";

const props = defineProps({
  entity: Object,
  title: String,
});

const usersStore = useUsersStore();

const userInOrganizationRows = computed(
  () => usersStore.getBaseColumnsWithPermmisions,
);

const rawDataButton = ref(false);
</script>

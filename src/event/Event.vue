<template>
  <v-timeline side="end">
    <v-timeline-item
      v-for="event in props.events"
      :key="event.id"
      :dot-color="getEventColor(event)"
      size="small"
    >
      <CreatedEvent
        v-if="getEventAction(event) === 'CREATE'"
        :title="getEventTitle(event)"
        :entity="getEventEntity(event)"
        :executor="getEventExecutor(event)"
        :date="getEventDate(event)"
        :entity-type="getEventEntityType(event)"
      />

      <UpdatedEvent
        v-if="getEventAction(event) === 'UPDATE'"
        :title="getEventTitle(event)"
        :entity="getEventEntity(event)"
        :executor="getEventExecutor(event)"
        :date="getEventDate(event)"
        :entity-type="getEventEntityType(event)"
      />

      <DeletedEvent
        v-if="getEventAction(event) === 'DELETE'"
        :title="getEventTitle(event)"
        :entity="getEventEntity(event)"
        :executor="getEventExecutor(event)"
        :date="getEventDate(event)"
        :entity-type="getEventEntityType(event)"
      />
    </v-timeline-item>
  </v-timeline>
</template>

<script setup>
import CreatedEvent from "./component/CreatedEvent.vue";
import UpdatedEvent from "./component/UpdatedEvent.vue";
import DeletedEvent from "./component/DeletedEvent.vue";

const props = defineProps({
  events: Array,
});

const eventConfig = {
  USER_CREATE: {
    action: "CREATE",
    title: "Created User",
    entityPath: "entity",
    executorPath: "executor",
    entityType: "user",
    color: "green",
  },
  USER_UPDATE: {
    action: "UPDATE",
    title: "Updated User",
    entityPath: "entityAfter",
    executorPath: "executor",
    entityType: "user",
    color: "purple",
  },
  USER_DELETE: {
    action: "DELETE",
    title: "Deleted User",
    entityPath: "entity",
    executorPath: "executor",
    entityType: "user",
    color: "red",
  },
  RESOURCE_CREATE: {
    action: "CREATE",
    title: "Created Resource",
    entityPath: "entity",
    executorPath: "executor",
    entityType: "resource",
    color: "green",
  },
  RESOURCE_UPDATE: {
    action: "UPDATE",
    title: "Updated Resource",
    entityPath: "entityAfter",
    executorPath: "executor",
    entityType: "resource",
    color: "purple",
  },
  RESOURCE_DELETE: {
    action: "DELETE",
    title: "Deleted Resource",
    entityPath: "entity",
    executorPath: "executor",
    entityType: "resource",
    color: "red",
  },
  ORGANIZATION_CREATE: {
    action: "CREATE",
    title: "Created Organization",
    entityPath: "entity",
    executorPath: "executor",
    entityType: "organization",
    color: "green",
  },
  ORGANIZATION_USER_CREATE: {
    action: "CREATE",
    title: "Created User In Organization",
    entityPath: "entity",
    executorPath: "executor",
    entityType: "user_in_organization",
    color: "green",
  },
  ORGANIZATION_USER_UPDATE: {
    action: "UPDATE",
    title: "Updated User In Organization",
    entityPath: "entityAfter",
    executorPath: "executor",
    entityType: "user_in_organization",
    color: "purple",
  },
  ORGANIZATION_USER_DELETE: {
    action: "DELETE",
    title: "Deleted User In Organization",
    entityPath: "entity",
    executorPath: "executor",
    entityType: "user_in_organization",
    color: "red",
  },
  ORGANIZATION_ADD_RESOURCE_QUANTITY: {
    action: "CREATE",
    title: "Added Resource Quantity To Organization",
    entityPath: "entityAfter.resourcesAndQuantities[0].resource",
    executorPath: "executor",
    entityType: "resource",
    color: "green",
  },
  ORGANIZATION_REMOVE_RESOURCE_QUANTITY: {
    action: "DELETE",
    title: "Removed Resource Quantity From Organization",
    entityPath: "entityAfter.resourcesAndQuantities[0].resource",
    executorPath: "executor",
    entityType: "resource",
    color: "red",
  },
  ORGANIZATION_PRODUCT_CREATE: {
    action: "CREATE",
    title: "Created Product In Organization",
    entityPath: "entity",
    executorPath: "executor",
    entityType: "product_in_organization",
    color: "green",
  },
  ORGANIZATION_PRODUCT_UPDATE: {
    action: "UPDATE",
    title: "Updated Product In Organization",
    entityPath: "entityAfter",
    executorPath: "executor",
    entityType: "product_in_organization",
    color: "purple",
  },
  ORGANIZATION_PRODUCT_DISASSEMBLY: {
    action: "DELETE",
    title: "Disassembled Product In Organization",
    entityPath: "entity",
    executorPath: "executor",
    entityType: "product_in_organization",
    color: "red",
  },
  ORGANIZATION_PRODUCT_TRANSFER: {
    action: "UPDATE",
    title: "Transferred Product In Organization",
    entityPath: "entityAfter",
    executorPath: "executor",
    entityType: "product_in_organization",
    color: "purple",
  },
  ORGANIZATION_RESOURCE_TRANSFER: {
    action: "UPDATE",
    title: "Transferred Resource In Organization",
    entityPath: "entity",
    executorPath: "executor",
    entityType: "resource_in_organization",
    color: "purple",
  },

  ORGANIZATION_CREATE_SALE: {
    action: "CREATE",
    title: "Created Sale",
    entityPath: "entity",
    executorPath: "executor",
    entityType: "sale",
    color: "green",
  },
  ORGANIZATION_SALE_RETURN_PRODUCT: {
    action: "UPDATE",
    title: "Returned Product From Sale",
    entityPath: "entity",
    executorPath: "executor",
    entityType: "sale",
    color: "purple",
  },

  ORGANIZATION_SALE_RETURN_RESOURCE: {
    action: "UPDATE",
    title: "Returned Resource From Sale",
    entityPath: "entity",
    executorPath: "executor",
    entityType: "sale",
    color: "purple",
  },
};

const getEventAction = (event) => {
  return eventConfig[event.type]?.action || "";
};

const getEventTitle = (event) => {
  return eventConfig[event.type]?.title || "";
};

const getEventEntity = (event) => {
  const path = eventConfig[event.type]?.entityPath;
  if (!path) return null;

  return path.split(".").reduce((current, segment) => {
    if (!current) return null;

    const match = segment.match(/^(\w+)\[(\d+)\]$/);

    if (match) {
      const [, key, index] = match;
      return current[key]?.[Number(index)];
    }

    return current[segment];
  }, event.payload);
};

const getEventExecutor = (event) => {
  const path = eventConfig[event.type]?.executorPath || "";
  return path.split(".").reduce((o, k) => o?.[k], event);
};

const getEventDate = (event) => {
  return new Date(event.timestamp).toLocaleString();
};

const getEventEntityType = (event) => {
  return eventConfig[event.type]?.entityType || "";
};

const getEventColor = (event) => {
  return eventConfig[event.type]?.color || "white";
};
</script>

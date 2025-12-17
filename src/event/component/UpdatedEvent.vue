<template>
  <v-card class="mx-auto" width="40vw" elevation="8" color="purple">
    <template #title>
      <span class="text-h4 font-weight-bold"> {{ props.title }} </span>
    </template>
    <v-card-text class="pa-6">
      <h2>{{ config.title(entity) }}</h2>
      <h4>{{ config.subtitle(entity) }}</h4>
      <div>Еxecutor: {{ config.executor(executor) }}</div>
      <small>{{ props.date }}</small>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  entity: Object,
  executor: Object,
  title: String,
  date: String,
  entityType: String,
});

const entityConfig = {
  user: {
    title: (entity) => `${entity.firstName} ${entity.lastName}`,
    subtitle: (entity) => entity.email,
    executor: (entity) => entity.firstName,
  },
  user_in_organization: {
    title: (entity) =>
      `${entity.member.user.firstName} ${entity.member.user.lastName}`,
    subtitle: (entity) => entity.organization.name,
    executor: (entity) => entity.firstName,
  },
  resource: {
    title: (entity) => `${entity.clazz}`,
    subtitle: (entity) => entity.sku,
    executor: (entity) => entity.firstName,
  },
  resource_in_organization: {
    title: (entity) => entity.transferredResource.resource.sku,
    subtitle: (entity) => entity.newOwner.name,
    executor: (entity) => entity.firstName,
  },
  product_in_organization: {
    title: (entity) => entity.products[0].catalogNumber,
    subtitle: (entity) => entity.organization.name,
    executor: (entity) => entity.firstName,
  },
  sale: {
    title: (entity) => entity.saleAfter?.buyer.firstName,
    subtitle: (entity) =>
      entity.returnedProduct?.catalogNumber || entity.returnedResource?.clazz,
    executor: (entity) => entity.firstName,
  },
};

const config = entityConfig[props.entityType];
</script>

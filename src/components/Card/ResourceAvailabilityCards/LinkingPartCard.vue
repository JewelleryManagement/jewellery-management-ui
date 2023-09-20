<template>
  <v-card class="mx-auto text-center" width="600">
    <v-card-title>
      <v-icon color="green">mdi-diamond</v-icon>
      {{ resource.clazz }}
      <v-icon color="green">mdi-diamond</v-icon>
    </v-card-title>
    <v-card-subtitle
      >Current quantity:
      {{ currentQuantity === "" ? "0" : currentQuantity }}</v-card-subtitle
    >

    <v-card-subtitle v-for="item in usersAndQuantities" :key="item.id">
      User: {{ item.owner.name }} - Quantity: {{ item.quantity }}
    </v-card-subtitle>

    <v-card-text>
      <div>Description: {{ resource.description }}</div>
      <div>Quantity Type: {{ resource.quantityType }}</div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["resource", "currentQuantity", "usersAndQuantities"],

  setup(props) {
    return {
      resource: props.resource,
      currentQuantity: props.currentQuantity,
      usersAndQuantities: props.usersAndQuantities,
    };
  },
};
</script>

<style scoped></style>

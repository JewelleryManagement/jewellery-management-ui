<template>
    <v-card class="mx-auto text-center" width="600">
      <v-card-title>
        <v-icon color="green">mdi-diamond</v-icon>
        {{ resource.clazz }}
      </v-card-title>
      <v-card-subtitle>Current quantity: {{ currentQuantity === '' ? '0' : currentQuantity}}</v-card-subtitle>
      <v-card-text>
        <div>Description: {{ resource.description }}</div>
        <div>Quantity Type: {{ resource.quantityType }}</div>
      </v-card-text>
    </v-card>
</template>

<script>
export default {
  props: ["resource", "currentQuantity"],
  setup(props) {
    return {
      resource: props.resource,
      currentQuantity: props.currentQuantity,
    };
  },
};
</script>

<style scoped></style>

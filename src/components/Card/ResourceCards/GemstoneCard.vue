<template>
  <v-card class="mx-auto text-center" width="600">
    <v-card-title>
      <v-icon color="pink">mdi-diamond</v-icon>
      {{ resource.clazz }}
      <v-icon color="pink">mdi-diamond</v-icon>
    </v-card-title>
    <v-card-subtitle
      >Current quantity:
      {{ currentQuantity === "" ? "0" : currentQuantity }}</v-card-subtitle
    >

    <v-card-subtitle v-for="item in usersAndValues" :key="item.id">
      User: {{ item.name }} - Quantity: {{ item.quantity }}
    </v-card-subtitle>

    <v-card-text>
      <div>Carat: {{ resource.carat }}</div>
      <div>Clarity: {{ resource.clarity }}</div>
      <div>Color: {{ resource.color }}</div>
      <div>Cut: {{ resource.cut }}</div>
      <div>
        Dimensions(x,y,z): {{ resource.dimensionX }} x
        {{ resource.dimensionY }} x {{ resource.dimensionZ }}
      </div>
      <div>Quantity Type: {{ resource.quantityType }}</div>
      <div>Shape: {{ resource.shape }}</div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["resource", "currentQuantity", "usersAndValues"],
  setup(props) {
    return {
      resource: props.resource,
      currentQuantity: props.currentQuantity,
      usersAndValues: props.usersAndValues,
    };
  },
};
</script>

<style scoped></style>

<template>
    <v-card class="mx-auto text-center" width="600">
      <v-card-title>
        <v-icon color="purple">mdi-diamond</v-icon>
        {{ resource.clazz }}
        <v-icon color="purple">mdi-diamond</v-icon>
      </v-card-title>
      <v-card-subtitle>Current quantity: {{ currentQuantity === '' ? '0' : currentQuantity}}</v-card-subtitle>
      <v-card-subtitle v-for="item in usersAndValues" :key="item.id">
      User: {{ item.name }} - Quantity: {{ item.quantity }}
    </v-card-subtitle>
    
      <v-card-text>
          <div>Color: {{ resource.color }}</div>
        <div>Plating: {{ resource.plating }}</div>
        <div>Purity: {{ resource.purity }}</div>
        <div>Quantity Type: {{ resource.quantityType }}</div>
        <div>Type: {{ resource.type }}</div>
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
      usersAndValues: props.usersAndValues
    };
  },
};
</script>

<style scoped></style>

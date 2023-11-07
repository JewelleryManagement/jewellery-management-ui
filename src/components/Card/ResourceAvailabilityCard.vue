<template>
  <v-container>
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

      <v-card-subtitle v-for="item in usersAndQuantities" :key="item.id">
        User: {{ item.owner.name }} - Quantity: {{ item.quantity }}
      </v-card-subtitle>

      <v-card-text>
        <div v-html="formattedResource"></div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { useStore } from "vuex";

export default {
  props: ['resourceAvailability', 'resourceQuantity'],
  
  setup(props) {
    
    let formatResource = (jsonObj) => {
      const store = useStore();
      const allTable = store.getters["resources/getTableColumns"];
      let output = "";
      for (const column of allTable) {
        const key = column.key;
        const title = column.title;
        if (jsonObj.hasOwnProperty(key) ) {
          output += `<p>${title}: ${jsonObj[key]}</p>`;
        }
      }
      return output;
    };

    return {
      resourceQuantity: props.resourceQuantity,
      resource: props.resourceAvailability.resource,
      formattedResource: formatResource(props.resourceAvailability.resource),
      currentQuantity: props.resourceQuantity.quantity,
      usersAndQuantities: props.resourceAvailability.usersAndQuantities,
    };
  },
};
</script>

<style scoped></style>

<template>
  <v-container>
    <v-card class="mx-auto pa-10" width="500" height="auto">
      <v-card-title class="text-h6">{{ user.name }}</v-card-title>
      <v-card-text>
        <div>Email: {{ user.email }}</div>
        <div>
          Resource Availability: {{ user.resourcesAndQuantities.length }}
        </div>
        <v-spacer></v-spacer>
        <div
          v-for="resource in user.resourcesAndQuantities"
          :key="resource.resource.id"
        >
          <p>{{ resource.resource.clazz }} - {{ resource.quantity }}</p>
        </div>
      </v-card-text>
    </v-card>

    <br>
    <v-card>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>

      <v-data-table :headers="tableColumns" :items="emptyArr" :search="search">
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { VDataTable } from "vuetify/labs/VDataTable";

export default {
  components: {
    VDataTable,
  },
  props: ["id"],
  setup(props) {
    const store = useStore();
    const user = computed(() => store.getters["users/getUserById"](props.id));
    const tableColumns = computed(() => store.getters["resources/getColumns"]);
    const search = ref("");
    const emptyArr = ref([]);

    for (let i = 0; i < user.value.resourcesAndQuantities.length; i++) {
      emptyArr.value.push(user.value.resourcesAndQuantities[i].resource);
    }

    console.log(emptyArr.value);

    return {
      user,
      tableColumns,
      search,
      emptyArr,
    };
  },
};
</script>

<style scoped></style>

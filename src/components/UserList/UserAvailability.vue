<template>
  <v-container class="my-12" fluid>
    <v-row justify="center">
      <v-col cols="10" max-width="1600">
        <user-card
          :name="user.name"
          :email="user.email"
          :resourcesAndQuantities="user.resourcesAndQuantities"
        ></user-card>

        <users-table
          :tableColumns="tableColumns"
          :resourceItem="resourceItem"
          :search="search"
          :name="user.name"
        ></users-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { VDataTable } from "vuetify/labs/VDataTable";
import UsersTable from "../Tables/UsersTable.vue";
import UserCard from "./UserCard.vue";

export default {
  components: {
    VDataTable,
    UsersTable,
    UserCard,
  },
  props: ["id"],
  setup(props) {
    const store = useStore();
    const user = computed(() => store.getters["users/getUserById"](props.id));
    const tableColumns = computed(() => store.getters["users/getColumns"]);
    const search = ref("");
    const resourceItem = ref([]);

    for (let i = 0; i < user.value.resourcesAndQuantities.length; i++) {
      let quantity = user.value.resourcesAndQuantities[i].quantity;
      let resource = user.value.resourcesAndQuantities[i].resource;
      resource.quantity = quantity;
      resourceItem.value.push(resource);
    }

    return {
      user,
      tableColumns,
      search,
      resourceItem,
    };
  },
};
</script>

<style scoped></style>

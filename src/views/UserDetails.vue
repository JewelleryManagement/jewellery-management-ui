<template>
  <v-container>
    <suspense>
      <template #default>
        <v-container class="my-12" fluid>
          <v-row justify="center">
            <v-col cols="10" max-width="1600">
              <suspense>
                <user-card
                  :name="user.name"
                  :email="user.email"
                  :resourcesAndQuantities="resourceItem"
                ></user-card>
              </suspense>
              <resource-availability-table
                :tableColumns="tableColumns"
                :resourceItem="resourceItem"
                :user="user"
              ></resource-availability-table>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template #fallback>
        <span>Loading...</span>
      </template>
    </suspense>
  </v-container>
</template>

<script>
import { computed, inject } from "vue";
import { useStore } from "vuex";
import { VDataTable } from "vuetify/labs/VDataTable";
import ResourceAvailabilityTable from "@/components/Table/ResourceAvailabilityTable.vue";
import UserCard from "@/components/Card/UserCard.vue";

export default {
  components: {
    VDataTable,
    ResourceAvailabilityTable,
    UserCard,
  },
  props: ["id"],
  async setup(props) {
    const store = useStore();
    const userId = props.id
    const snackbarProvider = inject("snackbarProvider");
    try {
      await store.dispatch("users/fetchResourcesForUser", userId);
    } catch (error) {
      snackbarProvider.showErrorSnackbar("Failed to fetch products.");
    }
    const tableColumns = computed(() => store.getters["users/getColumns"]);
    const resourceItem = computed(() => store.getters["users/getUserResources"]);
    const user = computed(() => store.getters["users/getUserById"](userId)).value;

    return {
      user,
      tableColumns,
      resourceItem,
    };
  },
};
</script>

<style scoped></style>

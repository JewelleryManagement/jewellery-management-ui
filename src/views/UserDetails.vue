
<template>
  <suspense>
    <template #default>
      <v-container class="my-12" fluid>
        <v-row justify="center">
          <v-col cols="10" max-width="1600">
            <suspense>
              <user-card
                :name="user.owner.name"
                :email="user.owner.email"
                :resourcesAndQuantities="user.resourcesAndQuantities"
              ></user-card>
            </suspense>
            <resource-availability-table
              :tableColumns="tableColumns"
              :resourceItem="resourceItem"
              :search="search"
              :name="user.owner.name"
            ></resource-availability-table>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template #fallback>
      <span>Loading...</span>
    </template>
  </suspense>
</template>

<script>
import { computed, ref, onMounted, inject } from "vue";
import { useStore } from "vuex";
import { VDataTable } from "vuetify/labs/VDataTable";
import ResourceAvailabilityTable from "@/components/Tables/ResourceAvailabilityTable.vue";
import UserCard from "@/components/Cards/UserCard.vue";

export default {
  components: {
    VDataTable,
    ResourceAvailabilityTable,
    UserCard,
  },
  props: ["id"],
  async setup(props) {
    const store = useStore();
    const showSnackbar = inject("showSnackbar");
    try {
      await store.dispatch("users/fetchResourcesPerUser", props.id);
    } catch (error) {
      showSnackbar({
        message: "Failed to fetch products.",
        color: "error",
        timeout: 4000,
        location: "top right",
      });
    }
    const user = computed(() => store.getters["users/getUserResources"]);
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

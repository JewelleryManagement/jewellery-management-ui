<template>
  <v-container class="my-12" fluid>
    <v-row justify="center">
      <v-col cols="10" max-width="1600">
        <v-card class="elevation-12">
          <div class="text-center">
            <h1>Resources table</h1>
          </div>
          <div class="d-flex justify-end">
            <v-col cols="12" sm="6" md="4" class="text-end">
              <v-btn rounded="xs" size="x-large" color="red" to="/resources/add"
                >Add resource</v-btn
              >
            </v-col>
          </div>

          <resource-table></resource-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { onMounted, inject } from "vue";
import ResourceTable from "@/components/Table/ResourceTable.vue";
import { useStore } from "vuex";

export default {
  components: {
    ResourceTable,
  },
  setup() {
    const store = useStore();
    const showSnackbar = inject("showSnackbar");

    onMounted(async () => {
      try {
        await store.dispatch("resources/fetchResources");
      } catch (error) {
        showSnackbar({
          message: "Failed to fetch resources.",
          color: "error",
          timeout: 4000,
          location: "top right",
        });
      }
    });

    return {};
  },
};
</script>

<style scoped></style>

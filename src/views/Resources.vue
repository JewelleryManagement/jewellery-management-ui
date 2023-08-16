<template>
  <v-container class="my-12" fluid>
    <v-row justify="center">
      <v-col cols="10" max-width="1600">
        <v-card class="elevation-12">
          <div class="text-center">
            <h1>Resources table</h1>
          </div>
          <resource-table></resource-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { onMounted, inject } from "vue";
import ResourceTable from "@/components/Tables/ResourceTable.vue";
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

<template>
  <v-container class="my-12" fluid>
    <v-row justify="center">
      <v-col cols="10" max-width="1600">
        <v-card class="elevation-12">
          <div class="text-center">
            <h1>Resources table</h1>
          </div>
          <resource-table :resources="resources"></resource-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ResourceTable from "@/components/Tables/ResourceTable.vue";
import { fetchResources } from "@/services/HttpClientService.js";

export default {
  components: {
    ResourceTable,
  },
  data() {
    return {
      resources: [],
    };
  },

  methods: {
    async fetchResources() {
      const fetchedResources = await fetchResources();
      this.resources = fetchedResources;
    },
  },
  mounted() {
    this.fetchResources();
  },
};
</script>

<style scoped></style>

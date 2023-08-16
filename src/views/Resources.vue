<template>
  <base-card class="container">
    <h1>Resources table</h1>
    <resource-table :resources="resources"></resource-table>
  </base-card>
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

<style>
.container {
  text-align: center;
}

.resource-table {
  margin-top: 1rem;
  width: 100%;
  border-collapse: collapse;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #f5f5f5;
}
</style>
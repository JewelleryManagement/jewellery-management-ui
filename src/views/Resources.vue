<template>
  <div class="container">
    <h1 class="resources-header">Resources table</h1>
    <resource-table :resources="resources"></resource-table>
  </div>
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

<style scoped>
.resources-header {
  background-color: var(--clr-inkwell);
  color: white;
  width: 40%;
  padding: 0.5rem;
  margin: auto;
  position: relative;
  top: 1.2rem;
  border-radius: 4px;
  z-index: -1;
}

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

@media (max-width: 480px) {
  .resources-header {
    font-size: 1rem;
    top: 0.7rem;
  }
}
</style>

<template>
  <div class="container">
    <h1 class="resources-header" style="top:1.5rem">Resources availability table</h1>
    <h1 class="resources-header" style="font-size:1rem">{{ userId }}</h1>  
    <resource-availability-table :userId="userId" :resources="resources"></resource-availability-table>
  </div>
</template>


<script>
import ResourceAvailabilityTable from "@/components/Tables/ResourceAvailabilityTable.vue";
import { fetchResourcesByUserID } from "@/services/HttpClientService.js";

export default {
  components: {
    ResourceAvailabilityTable,
  },
  data() {
    return {
      userId: null,
      resources: [], // Store fetched resources here
    };
  },
  async created() {
    this.userId = this.$route.params.userId;
    this.resources = await fetchResourcesByUserID(this.userId);
    console.log(this.resources)
  },
};
</script>

<style>
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

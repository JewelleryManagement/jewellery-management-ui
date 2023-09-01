<template>
  <div class="container">
    <h1 class="resources-header" style="top: 1.5rem">resourcesInUser availability table</h1>
    <h1 class="resources-header" style="font-size: 1rem">{{ ownerName }}</h1>
    <resource-availability-table :userId="userId" :resourcesInUser="resourcesInUser" v-if="resourcesInUser.resourcesAndQuantities"></resource-availability-table>
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
      resourcesInUser: {},
      ownerName: "Loading...",
    };
  },
  async created() {
    this.userId = this.$route.params.userId;
    this.resourcesInUser = await fetchResourcesByUserID(this.userId);
    if (this.resourcesInUser.resourcesAndQuantities.length > 0) {
      this.ownerName = this.resourcesInUser.owner.name;
    }else {
      this.ownerName = "This user doesn't have any resources";
    }
  },
};
</script>

<style>
.resources-header {
  background-color: var(--clr-inkwell);
  color: white;
  width: 100%;
  padding: 0.5rem 0rem 0.5rem 0rem;
  margin: auto;
  position: relative;
  top: 1.2rem;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
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
  .resourcesInUser-header {
    font-size: 1rem;
    top: 0.7rem;
  }
}
</style>
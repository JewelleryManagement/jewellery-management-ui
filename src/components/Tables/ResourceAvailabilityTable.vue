<template>
  <div>
    <div v-if="resources.length === 0">
      <p class="no-resources">No resources available.</p>
    </div>
    <div v-else>
      <div class="table">
        <table class="table-table">
          <thead class="table-component">
            <tr>
              <th>Owner Name</th>
              <th>Resource Type</th>
              <th>Resource Class</th>
              <th>Resource Color</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody class="table-component">
            <tr v-for="(resource, index) in resources" :key="index">
              <td>{{ resource.owner.name }}</td>
              <td>{{ resource.resources[index].type }}</td>
              <td>{{ resource.resources[index].clazz }}</td>
              <td>{{ resource.resources[index].color }}</td>
              <td>{{ resource.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button class="back-button" @click="goBack"><i class="fa fa-arrow-left"></i> Back to User List</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userId: {
      type: String,
      required: true,
    },
    resources: {
      type: Array,
      required: true,
    },
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'Users' }); // Replace 'UserList' with the actual route name
    },
  },
};
</script>

<style scoped>
.table-component td {
  padding: 0.5rem;
  text-align: left;
}

.table-component tr {
  background-color: var(--clr-inkwell);
  color: var(--clr-living-coral);
}

.table-component tr:hover {
  background-color: #424553;
  cursor: pointer;
}

.table-component th {
  padding: 0.5rem;
  text-align: left;
  white-space: nowrap;
  background-color: var(--clr-inkwell);
  color: var(--clr-living-coral);
  border-bottom: 2px solid;
}

.table-component th:hover {
  cursor: pointer;
}

.table {
  margin-top: 1rem;
  width: 100%;
  border-collapse: collapse;
  overflow-y: auto;
  border-radius: 8px;
}

.table-table tbody tr {
  height: 1.5rem;
}

.table-table {
  overflow: auto;
  z-index: 0;
}

.no-resources {
  font-size: 3rem;
  background-color: var(--clr-inkwell);
  color: var(--clr-living-coral);
  text-align: center;
  padding: 5rem;
}

.back-button { 
    position: absolute;
    left: 2rem;
    top: 7rem;
    padding: 0.5rem 1rem;
    background-color: var(--clr-living-coral);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
}

.back-button:hover {
  background-color: var(--clr-living-coral-hover);
}

.table::-webkit-scrollbar {
  width: 6px;
}

.table::-webkit-scrollbar-thumb {
  background-color: var(--clr-living-coral);
}

.table::-webkit-scrollbar-thumb:hover {
  background-color: var(--clr-living-coral-hover);
}

.table::-webkit-scrollbar-track {
  background-color: var(--clr-inkwell);
}

@media (max-width: 768px) {
  .table {
    height: auto;
  }
  .table-table {
    height: auto;
  }
}

@media (max-width: 480px) {
  .table {
    margin-top: 0.5rem;
  }
  .no-resources {
    font-size: 2rem;
  }
}
</style>

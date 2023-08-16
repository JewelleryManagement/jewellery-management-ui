<template>
  <div class="resource-container">
    <div class="selection-menu">
      <label for="gemstoneClass" class="menu-label">Select Resource Class:</label>
      <select v-model="selectedGemstoneClass" id="gemstoneClass" class="menu-select">
        <option value="ChooseClass" class="test">Choose class</option>
        <option v-for="clazz in gemstoneClasses" :key="clazz" class="menu-option">{{ clazz.label }}</option>
      </select>
    </div>
    <div v-if="selectedGemstoneClass === 'ChooseClass' && resources.length > 0">
      <p class="information select">Please select a resource class.</p>
    </div>
    <div v-else-if="filteredResources.length === 0 && resources.length > 0" class="information unavailable">
      No resources available.
    </div>
    <div v-else-if="resources.length == 0" class="information unavailable">
      This user doesn't have any resources
    </div>
    <div v-else>
      <div class="table">
        <table class="table-table">
          <thead class="table-component">
            <tr>
              <th v-if="selectedGemstoneClass == 'Pearls' || selectedGemstoneClass == 'Precious Metals' || selectedGemstoneClass == 'Gemstones'">Resource Type</th>
              <th v-if="selectedGemstoneClass == 'Pearls' || selectedGemstoneClass == 'Precious Metals' || selectedGemstoneClass == 'Gemstones'">Resource Color</th>
              <th v-if="selectedGemstoneClass == 'Pearls'">Size</th>   
              <th v-if="selectedGemstoneClass == 'Pearls'">Shape</th>   
              <th v-if="selectedGemstoneClass == 'Pearls'">Quality</th>   
              <th v-if="selectedGemstoneClass == 'Precious Metals'">Purity</th>   
              <th v-if="selectedGemstoneClass == 'Precious Metals'">Plating</th>   
              <th v-if="selectedGemstoneClass == 'Gemstones'">Quality</th>   
              <th v-if="selectedGemstoneClass == 'Gemstones'">Carat</th>   
              <th v-if="selectedGemstoneClass == 'Gemstones'">Cut</th>   
              <th v-if="selectedGemstoneClass == 'Gemstones'">Clarity</th>   
              <th v-if="selectedGemstoneClass == 'Gemstones'">DimensionX</th>   
              <th v-if="selectedGemstoneClass == 'Gemstones'">DimensionY</th>   
              <th v-if="selectedGemstoneClass == 'Gemstones'">DimensionZ</th>   
              <th v-if="selectedGemstoneClass == 'Linking Parts'">Description</th>   
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody class="table-component">
            <tr v-for="(resource, index) in filteredResources" :key="index">
              <td v-if="selectedGemstoneClass == 'Pearls' || selectedGemstoneClass == 'Precious Metals' || selectedGemstoneClass == 'Gemstones'">{{ resource.resources[index].type }}</td>
              <td v-if="selectedGemstoneClass == 'Pearls' || selectedGemstoneClass == 'Precious Metals'">{{ resource.resources[index].color }}</td>
              <td v-if="selectedGemstoneClass == 'Pearls'">{{ resource.resources[index].size }}</td>
              <td v-if="selectedGemstoneClass == 'Pearls' || selectedGemstoneClass == 'Gemstones'">{{ resource.resources[index].shape }}</td>
              <td v-if="selectedGemstoneClass == 'Pearls'">{{ resource.resources[index].quality }}</td>

              <td v-if="selectedGemstoneClass == 'Precious Metals'">{{ resource.resources[index].purity }}</td>
              <td v-if="selectedGemstoneClass == 'Precious Metals'">{{ resource.resources[index].plating }}</td>

              <td v-if="selectedGemstoneClass == 'Gemstones'">{{ resource.resources[index].quality }}</td>
              <td v-if="selectedGemstoneClass == 'Gemstones'">{{ resource.resources[index].carat }}</td>
              <td v-if="selectedGemstoneClass == 'Gemstones'">{{ resource.resources[index].cut }}</td>
              <td v-if="selectedGemstoneClass == 'Gemstones'">{{ resource.resources[index].clarity }}</td>
              <td v-if="selectedGemstoneClass == 'Gemstones'">{{ resource.resources[index].dimensionX }}</td>
              <td v-if="selectedGemstoneClass == 'Gemstones'">{{ resource.resources[index].dimensionY }}</td>
              <td v-if="selectedGemstoneClass == 'Gemstones'">{{ resource.resources[index].dimensionZ }}</td>
              
              <td v-if="selectedGemstoneClass == 'Linking Parts'">{{ resource.resources[index].description }}</td>
              
              <td>{{ resource.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <button class="back-button" @click="goBack"><i class="fa fa-arrow-left"></i> Back to User List</button>
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
  data() {
    return {
      selectedGemstoneClass: "ChooseClass",
      gemstoneClasses: [
        {
          name:"Gemstone",
          label: "Gemstones",
        }, 
        {
          name:"PreciousMetal",
          label: "Precious Metals",
        }, 
        {
          name:"Pearl",
          label: "Pearls",
        }, 
        {
          name:"LinkingPart",
          label: "Linking Parts",
        }, 
        ],
    };
  },
computed: {
  filteredResources() {
    if (this.selectedGemstoneClass === "ChooseClass") {
      return this.resources;
    } else {
      const selectedClass = this.gemstoneClasses.find(clazz => clazz.label === this.selectedGemstoneClass);
      if (selectedClass) {
        return this.resources.filter(resource => resource.resources[0].clazz === selectedClass.name);
      } else {
        return [];
      }
    }
  },
},
  methods: {
    goBack() {
      this.$router.push({ name: 'Users' });
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
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.table-table tbody tr {
  height: 1.5rem;
}

.table-table {
  overflow: auto;
  z-index: 0;
}

.information {
  font-size: 3rem;
  background-color: var(--clr-inkwell);
  color: var(--clr-living-coral);
  text-align: center;
  padding: 5rem;
}

.unavailable {
  position: relative;
  bottom: -1rem;
}

.select {
  position: relative;
  bottom: 1.8rem;
}

.selection-menu {
  width: 20.5%;
  position: absolute;
  top: 7rem;
  left: 65%;
  background-color: var(--clr-inkwell);
  color: var(--clr-living-coral);
  padding: 1rem 0rem 1rem 0rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  border-radius: 6px;
}

.menu-label {
  font-size: 1rem;
  margin-right: 1rem;
}

.menu-select {
  padding: 1rem 1rem;
  background-color: transparent;
  color: var(--clr-living-coral);
  border: 2px solid var(--clr-living-coral);
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.test {
  display: none;
}

.menu-select:hover {
  background-color: var(--clr-living-coral);
  color: white;
}

.menu-option {
  background-color: var(--clr-inkwell);
  color: var(--clr-living-coral);
  border: none;
}

.menu-option:hover {
    background-color: var(--clr-living-coral);
    color: white;
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

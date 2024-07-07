<template>
    <v-tooltip activator="parent" location="top">
      <div v-html="getResourceInformationHtml(props.resource)"></div>
    </v-tooltip>
  </template>
  
  <script setup>
  import { useStore } from 'vuex';
  import { computed } from 'vue';
  
  const props = defineProps({ saleData: Object, resource: Object });
  const store = useStore()
  
  const getResourceInformationHtml = (resource) => {
    const saleItem = props.saleData.find((item) => item.id === resource.id);
    if (!saleItem) return '';
  
    const resourceData = saleItem;
    const quantity = saleItem.quantity;
  
    const tableColumns = computed(() => store.getters["resources/getTableColumns"]).value;
  
    let resourceInfoHtml = "";
    for (const key in resourceData) {
      if (key !== "id" && resourceData[key] !== null) {
        const column = tableColumns.find(column => column.key === key);
        if (column) {
          resourceInfoHtml += `<b>${column.title}:</b> ${resourceData[key]}<br>`;
        }
      }
    }
    resourceInfoHtml += `<b>Quantity:</b> ${quantity}`;
  
    return resourceInfoHtml;
  };
  </script>
  
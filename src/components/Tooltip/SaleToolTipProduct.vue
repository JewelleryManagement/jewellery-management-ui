<template>
  <v-tooltip activator="parent" location="top">
    <div v-html="getProductInformationHtml(props.product)"></div>
  </v-tooltip>
</template>

<script setup>
import { useStore } from "vuex";
import { computed } from "vue";

const props = defineProps({ saleData: Object, product: Object });
const store = useStore();

const getProductInformationHtml = (product) => {
  const tableColumns = computed(() => [
    ...store.state.products.tableColumns,
    store.state.products.tableColumnOwner,
    store.state.products.tableColumnOrganization,
  ]).value;

  let productInfoHtml = "";
  for (const key in product) {
    if (key !== "id" && product[key] !== null) {
      const column = tableColumns.find((column) => column.key === key);
      if (column) {
        productInfoHtml += getColumnHtml(column, product[key]);
      }
    }
  }
  return productInfoHtml;
};

const getColumnHtml = (column, value) => {
  let columnHtml = `<b>${column.title}:</b>`;
  if (Array.isArray(value)) {
    columnHtml += handleArrayColumn(column, value);
  } else {
    columnHtml += handleNonArrayColumn(column, value);
  }
  return columnHtml;
};

const handleArrayColumn = (column, value) => {
  if (column.key === "authors") {
    return handleAuthorsArray(value);
  }
};

const handleNonArrayColumn = (column, value) => {
  if (column.key === "owner") {
    return handleOwnerColumn(value);
  } else {
    return ` ${value}<br>`;
  }
};

const handleAuthorsArray = (authors) => {
  let authorsHtml = "<br>";
  authors.forEach((author, index) => {
    authorsHtml += `${index + 1}. ${author.firstName} ${author.lastName}<br>`;
  });
  return authorsHtml;
};

const handleOwnerColumn = (owner) => {
  return ` ${owner.firstName} ${owner.lastName}<br>`;
};
</script>

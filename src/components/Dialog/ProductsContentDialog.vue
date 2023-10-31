<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="modelValue"
    transition="dialog-top-transition"
    width="auto"
  >
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-toolbar color="green" title="Products Content..."></v-toolbar>
        <products-table
          :products="productsContent"
        >
          <template v-slot:item.resourceContent="{ item }">
            <v-icon @click="openDialog(item, 'resources')">mdi-cube</v-icon>
          </template>

          <template v-slot:item.productsContent="{ item }">
            <v-icon @click="openDialog(item, 'products')"
              >mdi-cube-outline</v-icon
            >
          </template>

          <template v-slot:item.owner="{ item }">
            <router-link
              style="text-decoration: none; color: inherit"
              :to="`/users/${item.owner.id}`"
            >
              <v-btn variant="plain">
                <v-icon size="25">mdi-account-circle</v-icon>
                <v-tooltip activator="parent" location="top">
                  <div>Name: {{ item.owner.name }}</div>
                  <div>Email: {{ item.owner.email }}</div>
                </v-tooltip>
              </v-btn>
            </router-link>
          </template>
        </products-table>

        <v-card-actions class="justify-end">
          <v-btn color="red" variant="text" @click="() => $emit('close-dialog')"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>

  <resource-content-dialog
    v-if="isResourceDialogOpen"
    v-model="isResourceDialogOpen"
    :data="resourceDialogData"
    @close-dialog="closeDialog('resources')"
  ></resource-content-dialog>

  <products-content-dialog
    v-if="isProductsDialogOpen"
    v-model="isProductsDialogOpen"
    :data="productsDialogData"
    @close-dialog="closeDialog('products')"
  >
  </products-content-dialog>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, computed } from "vue";
const store = useStore();
import ProductsTable from "../Table/ProductsTable.vue";
const { modelValue, data } = defineProps({
  modelValue: Boolean,
  data: Object,
});
const [isResourceDialogOpen, resourceDialogData] = [ref(false), ref({})];
const [isProductsDialogOpen, productsDialogData] = [ref(false), ref({})];
const emits = defineEmits(["close-dialog"]);

const productsContent = ref(data.productsContent);
productsContent.value = productsContent.value.map((product) => ({
  ...product,
  authors: product.authors.map((a) => a.name).join(", "),
}));

const openDialog = (item, content) => {
  if (content == "resources") {
    resourceDialogData.value = item;
    isResourceDialogOpen.value = true;
  } else {
    productsDialogData.value = item;
    isProductsDialogOpen.value = true;
  }
};

const closeDialog = (content) => {
  if (content === "resources") {
    isResourceDialogOpen.value = false;
  } else {
    isProductsDialogOpen.value = false;
  }
};
</script>

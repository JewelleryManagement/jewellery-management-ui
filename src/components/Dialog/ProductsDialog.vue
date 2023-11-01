<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="modelValue"
    transition="dialog-top-transition"
    width="auto"
  >
    <template v-slot:default>
      <v-card>
        <v-toolbar color="green" title="Products..."></v-toolbar>
        <v-card-text>
          <products-table
            :products="ownedNonContentProducts"
            :additionalColumnsLeft="addColumn"
          >
            <template v-slot:item.add="{ item }">
              <v-icon color="blue" @click="addProductById(item.id)">{{
                btnIcon[item.id] || ICON_ADD
              }}</v-icon>
            </template>

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
        </v-card-text>

        <v-card-actions class="justify-space-between">
          <div>
            <p>
              Products selected: {{ temporarySelectedProducts.length || 0 }}
            </p>
          </div>

          <div>
            <v-btn color="#7986CB" variant="text" @click="clearTableValues"
              >Clear</v-btn
            >

            <v-btn color="green" variant="text" @click="saveTableValues"
              >Save</v-btn
            >
            <v-btn color="red" variant="text" @click="closeDialog()"
              >Close</v-btn
            >
          </div>
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
import ProductsTable from "@/components/Table/ProductsTable.vue";
import { ref, computed } from "vue";
import { useStore } from "vuex";
const store = useStore();
const { modelValue, userId } = defineProps({
  modelValue: Boolean,
  userId: String,
});
const ICON_ADD = ref("mdi-plus");
const ICON_REMOVE = ref("mdi-minus");
const [isResourceDialogOpen, resourceDialogData] = [ref(false), ref({})];
const [isProductsDialogOpen, productsDialogData] = [ref(false), ref({})];

try {
  await store.dispatch("products/fetchProductsByOwner", userId);
} catch (error) {
  snackbarProvider.showErrorSnackbar("Failed to fetch products.");
}
const ownedNonContentProducts = computed(() =>
  store.getters["products/getCurrentUserProducts"].filter(
    (product) => product.contentOf === 'No'
  )
);
const addColumn = computed(() => [store.getters["products/getAddColumn"]]);

const savedProductsIds = ref([]);
const temporarySelectedProducts = ref([]);
const btnIcon = ref({});

const emits = defineEmits(["save-product-dialog", "close-dialog"]);

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
  } else if (content === "products") {
    isProductsDialogOpen.value = false;
  } else {
    temporarySelectedProducts.value = [...savedProductsIds.value];
    btnIcon.value = [];
    savedProductsIds.value.forEach((id) => {
      btnIcon.value[id] = ICON_REMOVE;
    });
    emits("close-dialog", "products");
  }

};

const addProductById = (id) => {
  const selectedProductIndex = temporarySelectedProducts.value.findIndex(
    (selectedId) => selectedId === id
  );
  if (selectedProductIndex == -1) {
    temporarySelectedProducts.value.push(id);
    btnIcon.value[id] = ICON_REMOVE;
  } else {
    temporarySelectedProducts.value.splice(selectedProductIndex, 1);
    btnIcon.value[id] = ICON_ADD;
  }
};

const clearTableValues = () => {
  temporarySelectedProducts.value = [];
  btnIcon.value = {};
};

const saveTableValues = () => {
  savedProductsIds.value = [...temporarySelectedProducts.value];
  emits("save-product-dialog", savedProductsIds.value);
};
</script>

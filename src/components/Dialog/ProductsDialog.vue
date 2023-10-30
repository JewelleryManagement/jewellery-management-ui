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
            :additionalColumns="addColumn"
          >
            <template v-slot:item.add="{ item }">
              <v-icon color="blue" @click="addProductById(item.id)">{{
                btnIcon[item.id] || ICON_ADD
              }}</v-icon>
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

try {
  await store.dispatch("products/fetchProductsByOwner", userId);
} catch (error) {
  snackbarProvider.showErrorSnackbar("Failed to fetch products.");
}
const ownedNonContentProducts = computed(() =>
  store.getters["products/getCurrentUserProducts"].filter(
    (product) => product.contentOf === null
  )
);

const addColumn = computed(() => [store.getters["products/getAddColumn"]]);

const savedProductsIds = ref([]);
const temporarySelectedProducts = ref([]);
const btnIcon = ref({});

const emits = defineEmits(["save-product-dialog", "close-dialog"]);

const closeDialog = () => {
  temporarySelectedProducts.value = [...savedProductsIds.value];
  btnIcon.value = [];
  savedProductsIds.value.forEach((id) => {
    btnIcon.value[id] = ICON_REMOVE;
  });
  emits("close-dialog", "products");
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

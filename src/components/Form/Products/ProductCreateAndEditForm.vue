<template>
  <v-text-field
    v-model="productsInfo.catalogNumber"
    label="Catalog name"
    :rules="useTextFieldLargeRules()"
  ></v-text-field>

  <v-text-field
    v-model="productsInfo.description"
    label="Description of the product"
    :rules="useTextAreaFieldRules()"
  ></v-text-field>

  <v-autocomplete
    v-model="productsInfo.authors"
    clearable
    chips
    closable-chips
    label="Authors"
    :items="allUsers"
    :item-props="userPropsFormatter"
    multiple
    :rules="[validateAuthors(authors)]"
  >
  </v-autocomplete>

  <v-text-field
    class="mt-4"
    v-model="productsInfo.salePrice"
    label="Sale price"
    :rules="useNumberFieldRules()"
  ></v-text-field>

  <v-text-field
    label="Barcode..."
    v-model="productsInfo.productionNumber"
    :rules="useTextAreaFieldRules()"
  >
  </v-text-field>

  <div>
    <bar-code
      v-if="productsInfo.productionNumber"
      :productionNumber="productsInfo.productionNumber"
    />
  </div>

  <resources-dialog
    v-model="resourceDialog"
    :inputResources="productsInfo.resourcesContent"
    @save-resources-dialog="resourcesTableValues"
    @close-dialog="closeDialog"
  ></resources-dialog>

  <products-dialog
    v-model="productsDialog"
    @close-dialog="closeDialog"
    @save-product-dialog="productsTableValues"
    :userId="user.id"
  >
  </products-dialog>

  <div class="d-flex flex-column">
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="resourceDialog = true"> Resources </v-btn>

      <v-btn color="primary" @click="productsDialog = true"> Products </v-btn>
    </div>

    <div class="d-flex flex-column mt-4">
      <p v-if="productsInfo.resourcesContent.length > 0">
        Resources selected: {{ productsInfo.resourcesContent.length || 0 }}
      </p>

      <p v-if="productsInfo.productsContent.length > 0">
        Products selected: {{ productsInfo.productsContent.length || 0 }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import ResourcesDialog from "@/components/Dialog/ResourcesDialog.vue";
import ProductsDialog from "@/components/Dialog/ProductsDialog.vue";
import {
  useTextFieldLargeRules,
  useNumberFieldRules,
  useTextAreaFieldRules,
  validateAuthors,
} from "@/utils/validation-rules";
import { userPropsFormatter } from "@/utils/data-formatter";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
const { productsInfo } = defineProps({ productsInfo: Object });
const newObj = ref([])
for (const product of productsInfo.resourcesContent) {
    const newItem = {
    id: product.resource.id,
    quantity: product.quantity
  };
  newObj.value.push(newItem)
}

const store = useStore();
const route = useRoute();
const router = useRouter();
const snackbarProvider = inject("snackbarProvider");

const [catalogNumber, description, salePrice, productionNumber] = [
  ref(""),
  ref(""),
  ref(""),
  ref(""),
];
const [authors, resourcesContent, productsContent] = [
  ref([]),
  ref([]),
  ref([]),
];
const [resourceDialog, productsDialog] = [ref(false), ref(false)];

const pageTitle = ref(route.meta.title);
const user = computed(() => store.getters["auth/getUser"]).value;
const allUsers = computed(() => store.getters["users/allUsers"]).value;

const closeDialog = (payload) => {
  payload === "resources"
    ? (resourceDialog.value = false)
    : (productsDialog.value = false);
};

const resourcesTableValues = (resourceContentValue) => {
  resourcesContent.value = resourceContentValue;
  closeDialog("resources");
};

const productsTableValues = (productsContentValue) => {
  //   productsContent.value = productsContentValue.map((product) => product.id);
  closeDialog("products");
};
</script>

<style lang="scss" scoped></style>

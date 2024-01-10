<template>
  <v-text-field
    v-model="productInfo.catalogNumber"
    label="Catalog name"
    :rules="useTextFieldLargeRules()"
  ></v-text-field>

  <v-text-field
    v-model="productInfo.description"
    label="Description of the product"
    :rules="useTextAreaFieldRules()"
  ></v-text-field>

  <v-autocomplete
    v-model="productInfo.authors"
    clearable
    chips
    closable-chips
    label="Authors"
    :items="allUsers"
    :item-props="userPropsFormatter"
    multiple
    :rules="[validateAuthors(productInfo.authors)]"
  >
  </v-autocomplete>

  <v-text-field
    class="mt-4"
    v-model="productInfo.salePrice"
    label="Sale price"
    :rules="useNumberFieldRules()"
  ></v-text-field>

  <v-text-field
    label="Barcode..."
    v-model="productInfo.productionNumber"
    :rules="useTextAreaFieldRules()"
  >
  </v-text-field>

  <div>
    <bar-code
      v-if="productInfo.productionNumber"
      :productionNumber="productInfo.productionNumber"
    />
  </div>

  <resources-dialog
    v-model="resourceDialog"
    :inputResources="productInfo.resourcesContent"
    @save-resources-dialog="resourcesTableValues"
    @close-dialog="closeDialog"
  ></resources-dialog>

  <products-dialog
    v-model="productsDialog"
    @close-dialog="closeDialog"
    @save-product-dialog="productsTableValues"
    :userId="user.id"
    :inputPRoducts="productInfo.productsContent"
  >
  </products-dialog>

  <div class="d-flex flex-column">
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="resourceDialog = true"> Resources </v-btn>

      <v-btn color="primary" @click="productsDialog = true"> Products </v-btn>
    </div>

    <div class="d-flex flex-column mt-4">
      <p v-if="productInfo.resourcesContent.length > 0">
        Resources selected: {{ productInfo.resourcesContent.length || 0 }}
      </p>

      <p v-if="productInfo.productsContent.length > 0">
        Products selected: {{ productInfo.productsContent.length || 0 }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import ResourcesDialog from "@/components/Dialog/ResourcesDialog.vue";
import ProductsDialog from "@/components/Dialog/ProductsDialog.vue";
import {
  useTextFieldLargeRules,
  useNumberFieldRules,
  useTextAreaFieldRules,
  validateAuthors,
} from "@/utils/validation-rules";
import { userPropsFormatter } from "@/utils/data-formatter";
import { useStore } from "vuex";
const { productInfo } = defineProps({ productInfo: Object });
const store = useStore();
const [resourceDialog, productsDialog] = [ref(false), ref(false)];

const user = computed(() => store.getters["auth/getUser"]).value;
const allUsers = computed(() => store.getters["users/allUsers"]).value;

const closeDialog = (payload) => {
  payload === "resources"
    ? (resourceDialog.value = false)
    : (productsDialog.value = false);
};

const resourcesTableValues = (resourceContentValue) => {
  productInfo.resourcesContent = resourceContentValue;
  closeDialog("resources");
};

const productsTableValues = (productsContentValue) => {
  productInfo.productsContent = productsContentValue;
  closeDialog("products");
};
</script>

<style lang="scss" scoped></style>

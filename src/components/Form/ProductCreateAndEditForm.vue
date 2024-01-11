<template>
  <v-text-field
    v-model="props.productInfo.catalogNumber"
    label="Catalog name"
    :rules="useTextFieldLargeRules()"
    required
  ></v-text-field>

  <v-text-field
    v-model="props.productInfo.description"
    label="Description of the product"
    :rules="useTextAreaFieldRules()"
    required
  ></v-text-field>

  <v-autocomplete
    v-model="props.productInfo.authors"
    clearable
    chips
    closable-chips
    label="Authors"
    :items="allUsers"
    :item-props="userPropsFormatter"
    multiple
    :rules="
      props.productInfo.authors
        ? [validateAuthors(props.productInfo.authors)]
        : ['Please select at least 1 author']
    "
    required
  >
  </v-autocomplete>

  <v-text-field
    class="mt-4"
    v-model="props.productInfo.salePrice"
    label="Sale price"
    :rules="useNumberFieldRules()"
    required
  ></v-text-field>

  <v-text-field
    label="Barcode..."
    v-model="props.productInfo.productionNumber"
    :rules="useTextAreaFieldRules()"
    required
  >
  </v-text-field>

  <div>
    <bar-code
      v-if="props.productInfo.productionNumber"
      :productionNumber="props.productInfo.productionNumber"
      required
    />
  </div>

  <resources-dialog
    v-model="resourceDialog"
    :inputResources="props.productInfo.resourcesContent"
    @save-resources-dialog="resourcesTableValues"
    @close-dialog="closeDialog"
    :clearTable="props.clearTable"
  ></resources-dialog>

  <products-dialog
    v-model="productsDialog"
    @close-dialog="closeDialog"
    @save-product-dialog="productsTableValues"
    :userId="user.id"
    :inputPRoducts="props.productInfo.productsContent"
    :clearTable="props.clearTable"
  >
  </products-dialog>

  <div class="d-flex flex-column">
    <div class="d-flex justify-space-between">
      <v-btn color="primary" @click="resourceDialog = true"> Resources </v-btn>

      <v-btn color="primary" @click="productsDialog = true"> Products </v-btn>
    </div>

    <div class="d-flex flex-column mt-4">
      <p v-if="props.productInfo.resourcesContent?.length > 0">
        Resources selected:
        {{ props.productInfo.resourcesContent?.length || 0 }}
      </p>

      <p v-if="props.productInfo.productsContent?.length > 0">
        Products selected: {{ props.productInfo.productsContent?.length || 0 }}
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
const props = defineProps({
  productInfo: Object,
  clearTable: Boolean,
});
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
  props.productInfo.resourcesContent = resourceContentValue;
  closeDialog("resources");
};

const productsTableValues = (productsContentValue) => {
  props.productInfo.productsContent = productsContentValue;
  closeDialog("products");
};
</script>

<style lang="scss" scoped></style>

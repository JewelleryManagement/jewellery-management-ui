<template>
  <v-container>
    <v-sheet width="300" class="mx-auto">
      <div class="mx-auto text-center" style="font-size: 24px">
        {{ pageTitle }}
      </div>
      <v-form>
        <v-select label="Seller" v-model="seller" :items="allUsersNames">
        </v-select>

        <v-select
          v-model="buyer"
          label="Buyer"
          :items="allUsersNames"
          :rules="[validateAuthors(buyer)]"
        >
        </v-select>

        <v-btn color="primary" @click="openDialog" :disabled="!selectedProduct"> Products </v-btn>

        <v-container v-if="productsContent.length > 0">
          <p>
            Currently selected products:
            <span v-for="product in productsContent" :key="product">{{
              product
            }}</span>
          </p>
        </v-container>

        <div class="d-flex flex-column mt-4">
          <p>Total amount: {{ totalAmount }}</p>
          <p>Discounted amount: {{ discountedAmount }}</p>
          <p>Total Discount: {{ totalDiscount }}</p>
        </div>

        <div class="d-flex flex-column">
          <v-btn color="success" class="mt-4" block type="submit">Submit</v-btn>
          <v-btn color="error" class="mt-4" block>Reset</v-btn>
          <v-btn color="warning" class="mt-4" block @click="router.go(-1)"
            >Go Back</v-btn
          >
        </div>
      </v-form>
    </v-sheet>
    <products-dialog
      v-if="selectedProduct"
      v-model="productsDialog"
      @close-dialog="closeDialog"
      @save-product-dialog="productsTableValues"
      :userId="selectedProduct.id"
    >
    </products-dialog>
  </v-container>
</template>

<script setup>
import { validateAuthors } from "../utils/validation-rules";
import ProductsDialog from "@/components/Dialog/ProductsDialog.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, computed, watch } from "vue";
const route = useRoute();
const router = useRouter();
const seller = ref([]);

const selectedProduct = ref("");
watch(seller, (newValue) => {
  selectedProduct.value = allUsers.value.find((user) => user.name == seller.value);
});

const buyer = ref([]);
const store = useStore();
const pageTitle = ref(route.meta.title);

const [totalAmount, discountedAmount, totalDiscount] = [ref(0), ref(0), ref(0)];
const [productsDialog, productsContent] = [ref(false), ref([])];

const allUsers = computed(() => store.getters["users/allUsers"]);
const allUsersNames = allUsers.value.map((user) => user.name);

const openDialog = () => {
  productsDialog.value = true;
};

const closeDialog = () => {
  productsDialog.value = false;
};

const productsTableValues = (productsContentValue) => {
  productsContent.value = productsContentValue;
  closeDialog("products");
};
</script>

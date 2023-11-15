<template>
  <v-container>
    <v-sheet width="300" class="mx-auto">
      <div class="mx-auto text-center" style="font-size: 24px">
        {{ pageTitle }}
      </div>
      <v-form @submit.prevent="handleSubmit">
        <v-select label="Seller" v-model="seller" :items="allUsersNames">
        </v-select>

        <v-select
          v-model="buyer"
          label="Buyer"
          :items="allUsersNames"
          :rules="[validateAuthors(buyer)]"
        >
        </v-select>

        <v-btn color="primary" @click="openDialog" :disabled="!selectedUser">
          Products
        </v-btn>

        <div v-if="productsContent.length > 0">
          Currently selected products:
          <span v-for="(product, i) in productsContent" :key="product">
            <v-row class="mt-4">
              <v-col cols="8" class="pa-0">
                <v-text-field
                  prefix="€"
                  label="Price"
                  v-model="productsContent[i].salePrice"
                ></v-text-field>
              </v-col>
              <v-divider vertical style="height: 3.5rem"></v-divider>

              <v-col cols="4" class="pa-0">
                <v-text-field
                  suffix="%"
                  label="Discount"
                  v-model="productsContent[i].discount"
                ></v-text-field>
              </v-col>
            </v-row>
          </span>
        </div>

        <div class="d-flex flex-column mt-4">
          <p>Total amount: {{ totalAmount || 0 }}</p>
          <p>Discounted amount: {{ discountedAmount || 0 }}</p>
          <p>Total discount: {{ totalDiscount.toFixed(2) || 0 }} %</p>
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
      v-if="selectedUser"
      v-model="productsDialog"
      @close-dialog="closeDialog"
      @save-product-dialog="productsTableValues"
      :userId="selectedUser.id"
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

const selectedUser = ref("");
watch(seller, (newValue) => {
  selectedUser.value = allUsers.value.find((user) => user.name == seller.value);
  productsContent.value = [];
});

const buyer = ref([]);
const store = useStore();
const pageTitle = ref(route.meta.title);
const totalAmount = computed(() =>
  productsContent.value.reduce((acc, cur) => acc + Number(cur.salePrice), 0)
);

const discountedSmallAmount = computed(() =>
  productsContent.value.reduce(
    (acc, cur) => acc + (cur.salePrice * cur.discount) / 100,
    0
  )
);

const discountedAmount = computed(
  () => totalAmount.value - discountedSmallAmount.value
);

const totalDiscount = computed(() => {
  const totalAmountValue = totalAmount.value;
  const discountedAmountValue = discountedAmount.value;

  if (totalAmountValue === 0 || isNaN(discountedAmountValue)) {
    return 0;
  }

  return 100 - ((discountedAmountValue / totalAmountValue) * 100);
});

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

const handleSubmit = () => {
  console.log(productsContent.value);
};
</script>

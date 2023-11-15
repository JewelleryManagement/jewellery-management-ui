<template>
  <v-container>
    <v-sheet width="300" class="mx-auto">
      <div class="mx-auto text-center" style="font-size: 24px">
        {{ pageTitle }}
      </div>
      <v-form @submit.prevent="handleSubmit" ref="form">
        <v-select
          label="Seller"
          v-model="seller"
          :items="allUsersNames"
          :rules="[() => validateAuthors(seller)]"
          lazy-rules
        >
        </v-select>

        <v-select
          v-model="buyer"
          label="Buyer"
          :items="allUsersNames"
          :rules="[() => validateAuthors(buyer)]"
          lazy-rules
        >
        </v-select>

        <v-btn
          color="primary"
          @click="toggleDialog(true)"
          block
          :disabled="!selectedUser"
        >
          Products
        </v-btn>

        <v-container v-if="productsContent.length > 0">
          <div class="mx-auto text-center" style="font-size: 16px">
            Currently selected products:
          </div>
          <v-row
            class="mt-4"
            v-for="(product, i) in productsContent"
            :key="product"
          >
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
        </v-container>

        <v-container class="d-flex flex-column mt-4">
          <p>Total amount: € {{ totalAmount || 0 }}</p>
          <p>Discounted amount: € {{ discountedAmount || 0 }}</p>
          <p>Total discount: {{ totalDiscount.toFixed(2) || 0 }} %</p>
        </v-container>

        <div class="d-flex flex-column">
          <v-btn
            color="success"
            class="mt-4"
            block
            type="submit"
            :disabled="!formValid"
            >Submit</v-btn
          >
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
      @close-dialog="toggleDialog(false)"
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
import { ref, computed, watch, watchEffect } from "vue";
const [route, router] = [useRoute(), useRouter()];
const store = useStore();
const pageTitle = ref(route.meta.title);
const [seller, buyer] = [ref([]), ref([])];
const [form, formValid] = [ref(null), ref(true)];
const selectedUser = ref("");
const [productsDialog, productsContent] = [ref(false), ref([])];

const allUsers = computed(() => store.getters["users/allUsers"]);
const allUsersNames = allUsers.value.map((user) => user.name);

// Watches the form value and disables submit button
watchEffect(() => {
  if (form.value) {
    form.value.validate().then(({ valid }) => {
      formValid.value = valid;
    });
  }
});

// Watches for changes in seller input in order to trigger product's dialog for the seller only
watch(seller, (newValue) => {
  selectedUser.value = allUsers.value.find((user) => user.name == seller.value);
  productsContent.value = [];
});

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

  return 100 - (discountedAmountValue / totalAmountValue) * 100;
});

const toggleDialog = (isOpen) => {
  productsDialog.value = isOpen;
};

const productsTableValues = (productsContentValue) => {
  productsContent.value = productsContentValue;
  toggleDialog(false);
};

const handleSubmit = async () => {
  console.log(productsContent.value);
};
</script>

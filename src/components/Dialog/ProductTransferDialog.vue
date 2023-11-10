<template>
  <v-dialog :model-value="modelValue" @update:model-value="modelValue" persistent @click:outside="closeDialog">
    <v-form @submit.prevent="handleSubmit" ref="form" class="mt-4">
      <v-card class="mx-auto text-center pa-2" max-width="400" min-width="200">
        <v-card-title> Catalog Number: {{ item.catalogNumber }} </v-card-title>
        <v-select
          :items="userOptions"
          v-model="user"
          label="Select User"
          required
          :rules="[validateUser]"
        ></v-select>
        <div class="d-flex mx-auto">
          <v-btn color="success" class="mt-4" type="submit">Submit</v-btn>
          <v-btn color="error" class="mt-4" @click="closeDialog">Close</v-btn>
        </div>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { validateUser } from "@/utils/validation-rules";
import { ref, computed, inject } from "vue";
import { useStore } from "vuex";
const snackbarProvider = inject("snackbarProvider");
const props = defineProps(["modelValue", "item", "userId"]);
const { modelValue, item, userId } = props;
const [user, form] = [ref(""), ref(null)];
const store = useStore();

const emits = defineEmits(["close-dialog"]);

const allUsers = computed(() => store.getters["users/allUsers"]);
const userOptions = allUsers.value.map((user) => user.name);

async function fetchProducts() {
  try {
    store.dispatch("products/fetchProducts");
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch products.");
  }
}

async function fetchProductsForUser() {
  try {
    await store.dispatch("products/fetchProductsByOwner", userId);
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch user products.");
  }
}

const handleSubmit = async () => {
  const { valid } = await form.value.validate();
  const selectedUser = user.value;

  if (!valid) return;

  const data = {
    productId: item.id,
    recipientId: allUsers.value.find((user) => user.name == selectedUser).id,
  };
  try {
    await store.dispatch("products/transferProduct", data);
    userId ? await fetchProductsForUser() : await fetchProducts();
    snackbarProvider.showSuccessSnackbar("Successfully transferred product!");
    closeDialog();
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Couldn't transfer the product!");
  }
};

const closeDialog = async () => {
  resetForm();
  emits("close-dialog");
};

const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
  }
};
</script>

<template>
  <v-btn
    v-if="!item.sold && item.contentOf === 'No'"
    variant="plain"
    @click="openDialog"
  >
    <v-icon color="#607D8B" size="25">mdi-swap-horizontal</v-icon>
  </v-btn>

  <v-btn v-else variant="plain" disabled>
    <v-icon color="#607D8B" size="25">mdi-swap-horizontal</v-icon>
  </v-btn>

  <v-dialog v-model="dialog">
    <v-form @submit.prevent="handleSubmit" ref="form" class="mt-4">
      <v-card class="mx-auto text-center pa-2" width="400">
        <v-card-title>
          Catalog Number: {{ item.catalogNumber }}
        </v-card-title>
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
const props = defineProps({
  item: Object,
  userId: { type: String, default: null },
});
const snackbarProvider = inject("snackbarProvider");
const [item, userId] = [props.item, props.userId];
const store = useStore();
const allUsers = computed(() => store.getters["users/allUsers"]);
const userOptions = allUsers.value.map((user) => user.name);
const [user, form, dialog] = [ref(""), ref(null), ref(false)];

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
    form.value.reset()
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Couldn't transfer the product!");
  }
};

const openDialog = () => {
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="modelValue"
    persistent
    @click:outside="closeDialog"
  >
    <v-form @submit.prevent="handleSubmit" ref="form" class="mt-4">
      <v-card class="mx-auto text-center pa-2" max-width="400" min-width="200">
        <v-card-title>
          Catalog Number: {{ product.catalogNumber }}
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
const snackbarProvider = inject("snackbarProvider");
const props = defineProps({
  modelValue: Boolean,
  product: Object,
});
const { modelValue, product } = props;
const [user, form] = [ref(""), ref(null)];
const store = useStore();

const emits = defineEmits(["close-dialog"]);

const allUsers = computed(() => store.getters["users/allUsers"]);
const userOptions = allUsers.value.map((user) => user.firstName);

const handleSubmit = async () => {
  const { valid } = await form.value.validate();
  const selectedUser = user.value;

  if (!valid) return;

  const data = {
    productId: product.id,
    recipientId: allUsers.value.find((user) => user.firstName == selectedUser)
      .id,
  };
  try {
    await store.dispatch("products/transferProduct", data);
    snackbarProvider.showSuccessSnackbar("Successfully transferred product!");
    closeDialog("submitted");
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};

const closeDialog = async (response) => {
  resetForm();
  emits("close-dialog", response);
};

const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
  }
};
</script>

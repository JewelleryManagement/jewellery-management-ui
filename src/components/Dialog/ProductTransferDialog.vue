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
        <OrganizationSelect
          :selectedValue="selectedOrg"
          :items="allOrgsByUser"
          @organization-changed="updateSelectedOrg"
        />
        <div class="d-flex mx-auto">
          <v-btn color="success" class="mt-4" type="submit">Submit</v-btn>
          <v-btn color="error" class="mt-4" @click="closeDialog">Close</v-btn>
        </div>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import OrganizationSelect from "@/components/Select/OrganizationSelect.vue";
import { ref, computed, inject } from "vue";
import { useStore } from "vuex";
const snackbarProvider = inject("snackbarProvider");
const props = defineProps({
  modelValue: Boolean,
  product: Object,
});
const { modelValue, product } = props;
const [selectedOrg, form] = [ref(""), ref(null)];
const store = useStore();

const emits = defineEmits(["close-dialog"]);

const allOrgsByUser = computed(() => store.getters["organizations/getOrgs"]);

const postProducTransfer = async (data) => {
  try {
    await store.dispatch("products/transferProduct", data);
    snackbarProvider.showSuccessSnackbar("Successfully transferred product!");
    closeDialog("submitted");
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};

const updateSelectedOrg = (newOrg) => {
  if (newOrg) {
    selectedOrg.value = newOrg;
  }
};

const handleSubmit = async () => {
  const { valid } = await form.value.validate();
  const selectedOrgId = selectedOrg.value.id;

  if (!valid) return;

  const data = {
    productId: product.id,
    recipientId: selectedOrgId,
  };

  postProducTransfer(data);
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

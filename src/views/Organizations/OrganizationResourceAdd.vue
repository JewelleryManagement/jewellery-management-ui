<template>
  <v-container class="my-12" fluid>
    <resource-availability-card
      :resourceAvailability="resourceAvailability"
    ></resource-availability-card>

    <org-resource-form @handle-submit="handleSubmit" />
  </v-container>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import ResourceAvailabilityCard from "@/components/Card/ResourceAvailabilityCard.vue";
const { resourceId } = defineProps({
  resourceId: String,
});

const snackbarProvider = inject("snackbarProvider");
const store = useStore();
const router = useRouter();
const resourceAvailability = ref({});
resourceAvailability.value = await store.dispatch(
  "resources/fetchAvailabilityResourceById",
  resourceId
);

onMounted(async () => {
  try {
    await store.dispatch("organizations/fetchUserOrgs");
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Could not fetch user's organizations");
  }
});

const postAddQuantity = async (data) => {
  try {
    await store.dispatch("organizations/postResourceToOrg", data);
    snackbarProvider.showSuccessSnackbar("Successfully added quantity!");
    router.push("/resources");
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};

const handleSubmit = async (inputsData) => {
  const { organizationId, quantity, dealPrice } = inputsData;

  const data = {
    organizationId: organizationId,
    resourceId: resourceId,
    quantity: Number(quantity),
    dealPrice: dealPrice,
  };

  postAddQuantity(data);
};
</script>

<style scoped></style>

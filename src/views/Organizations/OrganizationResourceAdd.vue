<template>
  <v-container class="my-12" fluid>
    <resource-availability-card
      :resourceAvailability="resourceAvailability"
    ></resource-availability-card>
    <org-resource-form @handle-submit="handleSubmit"></org-resource-form>
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
  fetchUserOrg();
});

const fetchUserOrg = async () => {
  try {
    await store.dispatch("organizations/fetchOrgs");
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Could not fetch user's organizations");
  }
};

const postAddQuantity = async (data) => {
  try {
    await store.dispatch("organizations/postResourceToOrg", data);
    snackbarProvider.showSuccessSnackbar("Successfully added quantity!");
    router.push({
      path: "/resources",
      query: { filter: resourceAvailability.value.resource.clazz },
    });
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

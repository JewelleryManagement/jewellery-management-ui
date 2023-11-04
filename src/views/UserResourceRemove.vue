<template>
  <v-container class="my-12" fluid>
    <resource-availability-card
      :resourceAvailability="resourceAvailability"
    ></resource-availability-card>
    <user-resource-form @handle-submit="handleSubmit"></user-resource-form>
  </v-container>
</template>

<script setup>
import { ref, computed, inject, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ResourceAvailabilityCard from "@/components/Card/ResourceAvailabilityCard.vue";
const { resourceId, userId } = defineProps({
  resourceId: String,
  userId: String,
});
const snackbarProvider = inject("snackbarProvider");
const store = useStore();
const route = useRoute();
const router = useRouter();
const resourceAvailability = ref({});
resourceAvailability.value = await store.dispatch(
  "resources/fetchAvailabilityResourceById",
  resourceId
);
const resourceQuantity = ref({});
resourceQuantity.value = await store.dispatch(
  "resources/fetchQuantityByResourceId",
  resourceId
);

const resourceDetails = computed(
  () => store.getters["resources/getResourceForm"]
);

watch(route, (newValue) => {
  store.dispatch("resources/setResourceForm", {});
});

const handleSubmit = async () => {
  const { userOption, quantity } = resourceDetails.value;
  const userId = route.params.userId

    const data = {
      userId: userId,
      resourceId: resourceId,
      quantity: Number(quantity),
    };
    try {
      await store.dispatch("resources/removeQuantityFromResource", data);
      snackbarProvider.showSuccessSnackbar("Successfully removed quantity");
      router.push(`/users/${userId}`);
    } catch (error) {
      snackbarProvider.showErrorSnackbar("Couldn't update quantity");
    }
};
</script>

<style scoped></style>

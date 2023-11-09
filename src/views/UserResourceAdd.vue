<template>
  <v-container class="my-12" fluid>
    <resource-availability-card
      :resourceAvailability="resourceAvailability"
    ></resource-availability-card>

    <user-resource-form @handle-submit="handleSubmit"></user-resource-form>
  </v-container>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import ResourceAvailabilityCard from "@/components/Card/ResourceAvailabilityCard.vue";
const { resourceId, userId } = defineProps({
  resourceId: String,
  userId: String,
});
const snackbarProvider = inject("snackbarProvider");
const store = useStore();
const router = useRouter();
const allUsers = computed(() => store.getters["users/allUsers"]);
const resourceAvailability = ref({});
resourceAvailability.value = await store.dispatch(
  "resources/fetchAvailabilityResourceById",
  resourceId
);

const handleSubmit = async (inputsData) => {
  const { selectedUser, quantity } = inputsData;
  const userId = allUsers.value.find((user) => user.name == selectedUser);
  const data = {
    userId: userId.id,
    resourceId: resourceId,
    quantity: Number(quantity),
  };
  try {
    await store.dispatch("users/postResourcesToUser", data);
    snackbarProvider.showSuccessSnackbar("Successfully added quantity!");
    router.push("/resources");
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Couldn't add quantity");
  }
};
</script>

<style scoped></style>

<template>
  <v-container class="my-12" fluid>
    <resource-availability-card
      :resourceAvailability="resourceAvailability"
      :resourceQuantity="resourceQuantity"
    ></resource-availability-card>

    <!-- <v-sheet width="300" class="mx-auto">
      <div class="mx-auto text-center" style="font-size: 24px">
        {{ pageTitle }}
      </div>

      <v-form @submit.prevent="handleSubmit" ref="form" class="mt-4">
        <v-select
          label="Select user"
          :items="userOptions"
          v-model="selectedUser"
        >
        </v-select>

        <v-text-field
          v-model="quantityToSubmit"
          label="Quantity"
          :rules="numberFieldRules"
          required
        ></v-text-field>

        <div class="d-flex flex-column">
          <v-btn color="success" class="mt-4" block type="submit">Submit</v-btn>
          <v-btn color="error" class="mt-4" block @click="resetForm"
            >Reset</v-btn
          >
          <v-btn color="warning" class="mt-4" block @click="router.go(-1)"
            >Go Back</v-btn
          >
        </div>
      </v-form>
    </v-sheet> -->

    <user-resource-form
    @handle-submit="handleSubmit"
    ></user-resource-form>
  </v-container>
</template>

<script setup>
import { ref, computed, inject, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ResourceAvailabilityCard from "@/components/Card/ResourceAvailabilityCard.vue";

const snackbarProvider = inject("snackbarProvider");
const store = useStore();
const route = useRoute();
const router = useRouter();
const resourceId = route.params.resourceId
const userId = route.params.userId
const allUsers = computed(() => store.getters["users/allUsers"]);

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
})

const handleSubmit = async () => {
  const { userOption, quantity} = resourceDetails.value
  const selectedNewOwner = allUsers.value.find(
    (user) => user.name == userOption
  );

  const data = {
    previousOwnerId: userId,
    newOwnerId: selectedNewOwner.id,
    transferredResourceId: resourceId,
    quantity: quantity,
  };

  try {
    store.dispatch("resources/resourceAvailabilityTransfer", data);
    router.go(-1)
  } catch (error) {
    snackbarProvider.showErrorSnackbar('Failed to transfer resource')
  }
};

</script>

<style scoped></style>

<template>
  <v-container class="my-12" fluid>
    <resource-availability-card
      :resource="resource"
      :resourceAvailability="resourceAvailability"
      :resourceQuantity="resourceQuantity"
    ></resource-availability-card>

    <v-sheet width="300" class="mx-auto">
      <div class="mx-auto text-center" style="font-size: 24px">
        {{ pageTitle }}
      </div>

      <v-form @submit.prevent="handleSubmit" ref="form">
        <v-select
          label="Select user"
          :items="userOptions"
          v-model="selectedUser"
          :disabled="route.path.includes('/remove')"
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
    </v-sheet>
  </v-container>
</template>

<script>
import { ref, computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { useNumberFieldRules } from "../utils/validation-rules";
import ResourceAvailabilityCard from "@/components/Card/ResourceAvailabilityCard.vue";

export default {
  components: {
    ResourceAvailabilityCard,
  },
  props: {
    id: String,
    userId: String,
  },
  async setup(props) {
    const snackbarProvider = inject("snackbarProvider");
    const form = ref(null);
    const numberFieldRules = useNumberFieldRules();
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const pageTitle = ref(route.meta.title);
    const quantityToSubmit = ref("");
    const resourceId = props.id;
    const allUsers = computed(() => store.getters["users/allUsers"]);
    const selectedUser = ref("");
    const userOptions = computed(() =>
      store.getters["users/allUsers"].map((user) => user.name)
    );
    const resourceAvailability = await store.dispatch(
      "resources/fetchAvailabilityResourceById",
      resourceId
    );

    if (route.path.includes("/remove")) {
      selectedUser.value = route.query.name;
      const quantityByUser = resourceAvailability.usersAndQuantities.find(
        (item) => item.owner.name === route.query.name
      ).quantity;
      quantityToSubmit.value = quantityByUser;
    }

    const handleSubmit = async () => {
      const { valid } = await form.value.validate();
      const findUser = allUsers.value.find(
        (user) => user.name == selectedUser.value
      );
      if (valid) {
        const data = {
          userId: findUser.id,
          resourceId: props.id,
          quantity: quantityToSubmit.value,
        };
        try {
          if (route.path.includes("/add")) {
            await store.dispatch("users/postResourcesToUser", data);
            snackbarProvider.showSuccessSnackbar(
              "Successfully added quantity!"
            );
            router.push("/resources");
          } else if (route.path.includes("/remove")) {
            await store.dispatch("resources/removeQuantityFromResource", data);
            snackbarProvider.showSuccessSnackbar(
              "Successfully removed quantity"
            );
            router.push(`/users/${findUser.id}`);
          }
        } catch (error) {
          const errorMessage = route.path.includes("/add")
            ? "Couldn't add quantity"
            : "Couldn't update quantity";
          snackbarProvider.showErrorSnackbar(errorMessage);
        }
      }
    };

    return {
      route,
      router,
      resource: computed(() =>
        store.getters["resources/getResourceById"](props.id)
      ),
      resourceAvailability: resourceAvailability,
      resourceQuantity: await store.dispatch(
        "resources/fetchQuantityByResourceId",
        resourceId
      ),
      handleSubmit,
      resetForm() {
        if (form.value) {
          form.value.reset();
          form.value.resetValidation();
        }
      },
      form,
      pageTitle,
      quantityToSubmit,
      numberFieldRules,
      userOptions,
      selectedUser,
    };
  },
};
</script>

<style scoped></style>

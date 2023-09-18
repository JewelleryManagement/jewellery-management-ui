<template>
  <v-container class="my-12" fluid>
    <resource-card
      :resource="resource"
      :currentQuantity="currentQuantity"
      :quantityAndResourceByUser="quantityAndResourceByUser"
    ></resource-card>

    <v-sheet width="300" class="mx-auto">
      <div class="mx-auto text-center" style="font-size: 24px">
        {{ pageTitle }}
      </div>

      <v-form @submit.prevent="handleSubmit" ref="form">
        <v-select
          label="Select user"
          :items="userOptions"
          v-model="selectedUser"
        >
        </v-select>

        <v-text-field
          v-model="quantity"
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
import ResourceCard from "@/components/Card/ResourceCard.vue";

export default {
  components: {
    ResourceCard,
  },
  props: {
    id: String,
  },
  async setup(props) {
    const form = ref(null);
    const numberFieldRules = useNumberFieldRules();
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const pageTitle = ref(route.meta.title);
    const showSnackbar = inject("showSnackbar");
    const quantity = ref("");
    const resourceId = props.id;
    const resouceByUser = computed(
      () => store.getters["users/getUserResources"]
    ); // owner + resourcesAndQuantities
    const allUsers = computed(() => store.getters["users/allUsers"]);
    const selectedUser = ref("");
    const userOptions = computed(() =>
      store.getters["users/allUsers"].map((user) => user.name)
    );
    const currentQuantity = ref("");

    const quantityAndResourceByUser = ref([]);

    for (const index in allUsers.value) {
      const userId = allUsers.value[index].id;
      const res = await store.dispatch("users/fetchResourcesByUser", userId);
      quantityAndResourceByUser.value.push(res);
    }

    function getCurrentResourceQuantity() {
      const currentResources = resouceByUser.value.resourcesAndQuantities;

      for (const index in currentResources) {
        currentResources[index].resource.id === resourceId
          ? (currentQuantity.value += currentResources[index].quantity)
          : "";
      }
    }

    async function getCurrentResourceQuantityAndUser() {
      const url = router.options.history.state.back; // /users/userId
      const userId = url.substring(url.lastIndexOf("/") + 1); // substing to find userId
      try {
        await store.dispatch("users/fetchResourcesPerUser", userId);
        const user = computed(() => store.getters["users/getUserResources"]);
        const currentUserQuantity = user.value.resourcesAndQuantities;
        selectedUser.value = user.value.owner.name;

        for (const index in currentUserQuantity) {
          const currentUserResource = currentUserQuantity[index].resource;
          if (currentUserResource.id === resourceId) {
            const resourceQuantity = currentUserQuantity[index].quantity;
            quantity.value = resourceQuantity;
            currentQuantity.value = resourceQuantity;
          }
        }
      } catch (error) {
        showErrorSnackbar("Couldn't get user and its resource/quantity");
      }
    }

    if (route.path.includes("/add")) {
      getCurrentResourceQuantity();
    } else if (route.path.includes("/remove")) {
      getCurrentResourceQuantityAndUser();
    }

    const handleAddSubmit = async () => {
      const { valid } = await form.value.validate();
      const findUser = allUsers.value.find(
        (user) => user.name == selectedUser.value
      );
      if (valid) {
        const data = {
          userId: findUser.id,
          resourceId: props.id,
          quantity: quantity.value,
        };
        try {
          await store.dispatch("users/postResourcePerUser", data);
          showSuccessSnackbar("Successfully added quantity!");
          router.push("/resources");
        } catch (error) {
          showErrorSnackbar("Couldn't not add quantity");
        }
      }
    };

    const handleRemoveSubmit = async () => {
      // DELETE /resource/availability/{userId}/{resourceId}/{quantity}
      const { valid } = await form.value.validate();
      const findUser = allUsers.value.find(
        (user) => user.name == selectedUser.value
      );

      if (valid) {
        const data = {
          userId: findUser.id,
          resourceId: props.id,
          quantityNumber: quantity.value,
        };

        try {
          await store.dispatch("resources/removeQuantityFromResource", data);
          router.push(`/users/${findUser.id}`);
        } catch (error) {
          showErrorSnackbar("Couldn't not update quantity");
        }
      }
    };

    const showErrorSnackbar = (message) => {
      showSnackbar({
        message: message,
        color: "error",
        timeout: 4000,
        location: "bottom center",
      });
    };

    const showSuccessSnackbar = (message) => {
      showSnackbar({
        message: message,
        color: "success",
        timeout: 4000,
        location: "bottom center",
      });
    };

    return {
      quantityAndResourceByUser: quantityAndResourceByUser.value,
      router,
      resource: computed(() =>
        store.getters["resources/getResourceById"](props.id)
      ),
      handleSubmit: route.path.includes("/add")
        ? handleAddSubmit
        : handleRemoveSubmit,
      resetForm() {
        if (form.value) {
          form.value.reset();
          form.value.resetValidation();
        }
      },
      form,
      pageTitle,
      quantity,
      numberFieldRules,
      userOptions,
      selectedUser,
      currentQuantity,
    };
  },
};
</script>

<style scoped></style>

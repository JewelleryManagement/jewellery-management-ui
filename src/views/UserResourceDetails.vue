<template>
  <v-container class="my-12" fluid>
    <resource-card
      :resource="resource"
      :currentQuantity="currentQuantity"
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
          v-if="selected"
          v-model="quantity"
          label="Quantity"
          :rules="numberFieldRules"
          required
        ></v-text-field>

        <div v-if="selected" class="d-flex flex-column">
          <v-btn color="success" class="mt-4" block type="submit">Submit</v-btn>
          <v-btn color="error" class="mt-4" block @click="resetForm"
            >Reset</v-btn
          >
          <v-btn color="warning" class="mt-4" block to="/users"
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
  setup(props) {
    const form = ref(null);
    const numberFieldRules = useNumberFieldRules();
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const pageTitle = ref(route.meta.title);
    const showSnackbar = inject("showSnackbar");
    const selected = ref("");
    const isEditState = props.id !== undefined;
    const currentQuantity = ref("");
    const quantity = ref("");

    // if (route.path.includes("/add/")) {
    //   console.log("yes");
    // }

    const resourceDetails = computed(() =>store.getters["resources/getResourceById"](props.id));
    const resouceByUser = computed(() => store.getters["users/getUserResources"]);
    const allUsers = computed(() => store.getters["users/allUsers"]);

    // TO DO -------------
    // for (const key in allUsers.value) {
    //   const userId = allUsers.value[key].id;
    //   const userResource = store.getters["resources/getResourceById"](userId);
    //   console.log(userResource);
    // }

    for (const key in resouceByUser.value.resourcesAndQuantities) {
      if (resouceByUser.value.resourcesAndQuantities[key].resource.id === props.id) {
        currentQuantity.value += resouceByUser.value.resourcesAndQuantities[key].quantity;
      }
    }

    const selectedUser = ref("");

    const userOptions = ref([]);
    for (const key in allUsers.value) {
      userOptions.value.push(allUsers.value[key].name);
    }

    if (isEditState) {
      store.dispatch("resources/setResourceDetails", resourceDetails.value);
      selected.value =
        resourceDetails.value.clazz +
        " - " +
        (resourceDetails.value.type ||
          resourceDetails.value.clarity ||
          resourceDetails.value.description);
    }

    const resetForm = () => {
      if (form.value) {
        form.value.reset();
        form.value.resetValidation();
      }
    };

    const handleSubmit = async () => {
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
      resource: resourceDetails.value,
      isEditState,
      handleSubmit,
      resetForm,
      form,
      pageTitle,
      selected,
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

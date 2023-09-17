<template>
  <v-container class="my-12" fluid>
    <resource-card
      :resource="resource"
      :currentQuantity="currentQuantity"
      :emptyArr="emptyArr"
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
    const currentQuantity = ref("");
    const quantity = ref("");
    const resourceDetails = computed(() =>store.getters["resources/getResourceById"](props.id)); // the exact resource
    const resouceByUser = computed(() => store.getters["users/getUserResources"]); // owner + resourcesAndQuantities
    const allUsers = computed(() => store.getters["users/allUsers"]);
    const selectedUser = ref("");
    const userOptions = ref([]);

    const emptyArr = ref([])
    for (const key in allUsers.value) {
      const userId = allUsers.value[key].id;
      const res = await store.dispatch("users/fetchResourcesByUser", userId);
      emptyArr.value.push(res)
    }

    for (const key in allUsers.value) {
      userOptions.value.push(allUsers.value[key].name); // Gives user input options
    }


    if (pageTitle.value.includes("Add")) {
      for (const key in resouceByUser.value.resourcesAndQuantities) {
      if (resouceByUser.value.resourcesAndQuantities[key].resource.id === props.id) {
        currentQuantity.value += resouceByUser.value.resourcesAndQuantities[key].quantity;
      }
    }
    } else if (pageTitle.value.includes("Remove")) {
      const url = router.options.history.state.back
      const userId = url.substring(url.lastIndexOf('/') + 1);
      try {
        await store.dispatch("users/fetchResourcesPerUser", userId);
        const user = computed(() => store.getters["users/getUserResources"]);
        selectedUser.value = user.value.owner.name
        
        for (const key in user.value.resourcesAndQuantities) {
          const exactResource = user.value.resourcesAndQuantities[key].resource
          if (exactResource.id === props.id) {
            const resourceQuantity = user.value.resourcesAndQuantities[key].quantity
            quantity.value = resourceQuantity
            currentQuantity.value = resourceQuantity
          }
        }
      } catch (error) {
        console.log(error);
      }

      // TO DO REMOVE API
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
      emptyArr: emptyArr.value,
      router,
      resource: resourceDetails.value,
      handleSubmit,
      resetForm,
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

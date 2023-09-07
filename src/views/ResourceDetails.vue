<template>
  <v-container class="my-12" fluid>
    <v-card class="mx-auto pa-10" width="800" height="auto">
      <template v-slot:title>
        <div class="mx-auto text-center" style="font-size: 24px">
          {{ pageTitle }}
        </div>
      </template>

      <v-sheet width="300" class="mx-auto">
        <v-select
          v-model="selected"
          :items="options"
          label="Select resource type"
          :disabled="isEditState"
        ></v-select>

        <v-form @submit.prevent="handleSubmit" ref="form">
          <Pearl v-if="selected === 'Pearl'" />
          <PreciousMetal v-if="selected === 'PreciousMetal'" />
          <Gemstone v-if="selected === 'Gemstone'" />
          <LinkingPart v-if="selected === 'LinkingPart'" />

          <div v-if="selected" class="d-flex flex-column">
            <v-btn color="success" class="mt-4" block type="submit">
              Submit
            </v-btn>

            <v-btn color="error" class="mt-4" block @click="resetForm">
              Reset
            </v-btn>

            <v-btn color="warning" class="mt-4" block to="/resources">
              Go Back
            </v-btn>
          </div>
        </v-form>
      </v-sheet>
    </v-card>
  </v-container>
</template>

<script>
import { ref, computed, watch, inject } from "vue";
import Pearl from "../components/Form/Pearl.vue";
import PreciousMetal from "../components/Form/PreciousMetal.vue";
import Gemstone from "../components/Form/Gemstone.vue";
import LinkingPart from "../components/Form/LinkingPart.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  components: {
    Pearl,
    PreciousMetal,
    Gemstone,
    LinkingPart,
  },
  props: {
    id: String,
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const options = ref(["Pearl", "Gemstone", "PreciousMetal", "LinkingPart"]);
    const pageTitle = ref(route.meta.title);
    const resourceDetails = computed(
      () => store.getters["resources/getResourceDetails"]
    );
    const showSnackbar = inject("showSnackbar");
    const selected = ref("");
    const isEditState = props.id !== undefined;

    const form = ref(null);

    if (isEditState) {
      const resourceDetails = computed(() =>
        store.getters["resources/getResourceById"](props.id)
      );
      store.dispatch("resources/setResourceDetails", resourceDetails.value);
      selected.value = resourceDetails.value.clazz;
    }

    watch(selected, (newValue) => {
      //Reset input data on selection change
      store.dispatch("resources/setResourceDetails", { clazz: newValue });
    });

    const resetForm = () => {
      if (form.value) {
        form.value.reset();
        form.value.resetValidation();
      }
    };

    const handleSubmit = async () => {
      const { valid } = await form.value.validate();
      if (valid) {
        if (isEditState) {
          editResource();
        } else {
          createResource();
        }
      }
    };

    const editResource = async () => {
      try {
        await store.dispatch("resources/updateResource", resourceDetails.value);
        showSuccessSnackbar("Successfully edited resource!");
        router.push("/resources");
      } catch (error) {
        showErrorSnackbar("Couldn't edit resouce");
      }
    };

    const createResource = async () => {
      try {
        await store.dispatch("resources/createResource", resourceDetails.value);
        showSuccessSnackbar("Successfully created resource!");
        router.push("/resources");
      } catch (error) {
        showErrorSnackbar("Couldn't create resource");
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
      isEditState,
      handleSubmit,
      resetForm,
      form,
      pageTitle,
      selected,
      options,
    };
  },
};
</script>

<style scoped></style>

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
          :disabled="isDisabled"
        ></v-select>

        <v-form @submit.prevent="handleSubmit" ref="form">
          <Pearl v-if="selected === 'Pearl'" />
          <PreciousMetal v-if="selected === 'PreciousMetal'" />
          <Gemstone v-if="selected === 'Gemstone'" />
          <LinkingPart v-if="selected === 'LinkingPart'" />

          <v-card-text
            v-if="sentData"
            class="text-red-darken-4 text-center text-h6 pa-0"
            style="height: 1rem"
          >
            {{
              getText("Item has been updated", "Information has been submited")
            }}
          </v-card-text>
          <div v-else style="height: 1rem"></div>

          <div v-if="selected" class="d-flex flex-column">
            <v-btn color="success" class="mt-4" block type="submit">
              {{ getText("Edit", "Submit") }}
            </v-btn>

            <v-btn color="error" class="mt-4" block @click="resData">
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
import Pearl from "../components/AddResources/Pearl.vue";
import PreciousMetal from "../components/AddResources/PreciousMetal.vue";
import Gemstone from "../components/AddResources/Gemstone.vue";
import LinkingPart from "../components/AddResources/LinkingPart.vue";
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
    const getText = computed(() => (text1, text2) => {
      return pageTitle.value === "Edit resource" ? text1 : text2;
    });

    const showSnackbar = inject("showSnackbar");
    const selected = ref("");
    const isDisabled = ref(false);

    const form = ref(null);
    const sentData = ref(false);
    const resourceDetails = computed(
      () => store.state.resources.resourceDetails
    );

    if (props.id) {
      isDisabled.value = true;
      const resourceDetails = computed(() =>
        store.getters["resources/getResourceById"](props.id)
      );
      store.dispatch("resources/setResourceDetails", resourceDetails.value);
      selected.value = resourceDetails.value.clazz;
    }

    const handleSelectedOption = (newValue) => {
      selected.value = newValue;
    };

    watch(selected, (newValue) => {
      //Reset input data on selection change
      store.dispatch("resources/setResourceDetails", {});
    });

    const resData = () => {
      if (form.value) {
        form.value.reset();
        form.value.resetValidation();
      }
    };

    const handleSubmit = async () => {
      const { valid } = await form.value.validate();

      if (valid && props.id) {
        // edit
        try {
          store.dispatch("resources/updateSomeResource", resourceDetails.value);
          infoSent();
          router.push("/resources");
        } catch (error) {
          showSnackbar({
            message: "Failed to send resource.",
            color: "error",
            timeout: 4000,
            location: "top right",
          });
        }
      } else {
        // add
        try {
          await store.dispatch("resources/AddResource", {
            clazz: selected.value,
            ...resourceDetails.value,
          });
          infoSent();
          resData();
          router.push("/resources");

        } catch (error) {
          showSnackbar({
            message: "Failed to send resource.",
            color: "error",
            timeout: 4000,
            location: "top right",
          });
        }
      }
    };

    const infoSent = () => {
      sentData.value = true;

      setTimeout(() => {
        sentData.value = false;
      }, 4000);
    };

    return {
      isDisabled,
      getText,
      handleSubmit,
      resData,
      sentData,
      infoSent,
      form,
      pageTitle,
      handleSelectedOption,
      selected,
      options,
    };
  },
};
</script>

<style scoped></style>

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
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default {
  components: {
    Pearl,
    PreciousMetal,
    Gemstone,
    LinkingPart
  },
  props: {
    id: String,
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const options = ref(["Pearl", "Gemstone", "PreciousMetal", "LinkingPart"]);
    const pageTitle = ref(route.meta.title);
    const getText = computed(() => (text1, text2) => {
      return pageTitle.value === "Edit resource" ? text1 : text2;
    });

    const showSnackbar = inject("showSnackbar");
    const selected = ref("");
    const form = ref(null);
    const sentData = ref(false);
    const formData = computed(() => store.state.resources.resourceDetails);

    if (props.id) {
      const data = computed(() =>store.getters["resources/getResourceById"](props.id));
      store.dispatch("resources/setResourceDetails", data.value);
      const resourceDetail = computed(() => store.getters["resources/getResourceDetails"]);
      selected.value = resourceDetail.value.clazz;
    }

    const handleSelectedOption = (newValue) => {
      selected.value = newValue;
    };

    watch(selected, (newValue) => {
      //Reset input data on selection change
      store.dispatch("resources/updateFormData", {});
    });

    const resData = () => {
      if (form.value) {
        console.log(form.value);
        form.value.reset();
        form.value.resetValidation();
      }
    };

    const handleSubmit = async () => {
      const { valid } = await form.value.validate();
      if (valid && pageTitle.value === "Add resource") {
        store.dispatch("resources/setResourceDetails", {
          clazz: selected.value,
          ...formData.value,
        });
        try {
          await store.dispatch("resources/AddResources", {
            clazz: selected.value,
            ...formData.value,
          });
          infoSent();
          resData();
        } catch (error) {
          showSnackbar({
            message: "Failed to send resource.",
            color: "error",
            timeout: 4000,
            location: "top right",
          });
        }
      } else if (valid && pageTitle.value == "Edit resource") {
        const resourceDetail = computed(
          () => store.getters["resources/getResourceDetails"]
        );
        try {
          store.dispatch("resources/updateSomeResource", resourceDetail.value);
          infoSent();
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

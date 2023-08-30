<template>
  <v-container class="my-12" fluid>
    <v-card class="mx-auto pa-10" width="800" height="auto">
      <template v-slot:title>
        <div class="mx-auto text-center" style="font-size: 24px">
          {{ pageTitle }}
        </div>
      </template>

      <v-sheet width="300" class="mx-auto">
        <!-- <Select
          :select-value="select"
          @selected-option="handleSelectedOption"
        /> -->

        <v-select
          v-model="selected"
          :items="options"
          label="Select resource type"
        ></v-select>

        <v-form @submit.prevent="handleSubmit" ref="form">
          <Pearl v-if="selected === 'Pearl'" />
          <!-- <PreciousMetal v-if="selected === 'PreciousMetal'" /> -->
          <div v-if="selected" class="d-flex flex-column">
            <v-btn color="success" class="mt-4" block type="submit">
              Submit
            </v-btn>

            <v-btn color="error" class="mt-4" block @click="resData">
              Reset
            </v-btn>
          </div>
        </v-form>
      </v-sheet>
    </v-card>
  </v-container>
</template>

<script>
import { ref, computed, watch } from "vue";
import Pearl from "../components/AddResources/Pearl.vue";
import PreciousMetal from "../components/AddResources/PreciousMetal.vue";
import Select from "../components/AddResources/Select.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  components: {
    Pearl,
    Select,
    PreciousMetal,
  },
  props: {
    id: String,
  },
  setup(props) {
    const options = ref(["Pearl", "Gemstone", "PreciousMetal", "LinkingPart"]);

    const store = useStore();
    const select = ref("");
    const selected = ref("");
    const form = ref(null);
    const sentData = ref(false);
    const formData = computed(() => store.state.resources.resourceDetails);
    console.log(formData.value);

    const route = useRoute();
    // const router = useRouter();
    const pageTitle = ref(route.meta.title);

    if (props.id) {
      const data = computed(() =>
        store.getters["resources/getResourceById"](props.id)
      );
      store.dispatch("resources/setResourceDetails", data.value);
      const asd = computed(() => store.getters["resources/getResourceDetails"]);
      console.log(asd.value);
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

    const handleSubmit = () => {
      console.log(formData.value);
      store.dispatch('resources/setResourceDetails', formData.value)
      // Submit form data to the backend endpoint based on selected option
      // You can dispatch an action here to handle the submission
      // For example: this.$store.dispatch('submitFormData', this.formData);
    };

    // const submitForm = async () => {
    //   const { clazz, type, size, quality, color, shape } = toRefs(inputField);

    //   const { valid } = await form.value.validate();
    //   if (valid) {
    //     try {
    //       const dataToSubmit = {
    //         clazz: clazz.value,
    //         type: type.value,
    //         size: size.value,
    //         quality: quality.value,
    //         color: color.value,
    //         shape: shape.value,
    //       };

    //       await store.dispatch("resources/AddResources", dataToSubmit);
    //       infoSent();
    //       resData();
    //     } catch (error) {
    //       console.log(error);
    //       showSnackbar({
    //         message: "Failed to send resource.",
    //         color: "error",
    //         timeout: 4000,
    //         location: "top right",
    //       });
    //     }
    //   }
    // };


    return {
      handleSubmit,
      resData,
      form,
      pageTitle,
      handleSelectedOption,
      select,
      selected,
      options
    };
  },
};
</script>

<style scoped></style>

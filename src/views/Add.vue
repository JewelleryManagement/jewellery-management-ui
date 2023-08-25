<template>
  <v-container class="my-12" fluid>
    <v-card class="mx-auto pa-10" width="800" height="auto">
      <template v-slot:title>
        <div class="mx-auto text-center" style="font-size: 24px">
          Add a resource
        </div>
      </template>

      <v-sheet width="300" class="mx-auto">
        <Select
          :select-value="select"
          @selected-option="handleSelectedOption"
        />
        <v-form ref="form">
          <Pearl
            v-if="selected === 'Pearl'"
            @form-data="getFormData"
            @reset-form-data="resData"
          />
        </v-form>


      </v-sheet>
    </v-card>
  </v-container>
</template>

<script>
import { ref, inject } from "vue";
import Pearl from "../components/AddResources/Pearl.vue";
import Select from "../components/AddResources/Select.vue";
import { useStore } from "vuex";

export default {
  components: {
    Pearl,
    Select,
  },
  setup() {
    const store = useStore();
    const form = ref(null);
    const showSnackbar = inject("showSnackbar");
    const select = ref("");
    const selected = ref("");

    const getFormData = async (data) => {
      try {
        await store.dispatch("resources/AddResources", data);
        console.log(await form.value.validate());
        resData();
      } catch (error) {
        console.log(error);
        showSnackbar({
          message: "Failed to send resource.",
          color: "error",
          timeout: 4000,
          location: "top right",
        });
      }
    };

    const handleSelectedOption = (newValue) => {
      selected.value = newValue;
    };

    const resData = () => {
      if (form.value) {
        form.value.reset();
        form.value.resetValidation();
      }
    };


    return {
      resData,
      handleSelectedOption,
      getFormData,
      select,
      selected,
      form,
    };
  },
};
</script>

<style scoped></style>

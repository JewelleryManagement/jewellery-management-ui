<template>
  <v-container class="my-12" fluid>
    <v-card class="mx-auto pa-10" width="800" height="auto">
      <template v-slot:title>
        <div class="mx-auto text-center" style="font-size: 24px">
          Add a resource
        </div>
      </template>

      <v-sheet width="300" class="mx-auto">
        <v-form ref="formRef">
          <Select
            :select-value="select"
            @selected-option="handleSelectedOption"
          />
          <!-- <v-select
            v-model="select"
            :items="items"
            :rules="[(v) => !!v || 'Item is required']"
            label="Item"
            required
            return-object
          ></v-select> -->

          {{ select }}
          <Pearl v-if="selected === 'Pearl'" @form-data="getFormData" />
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
    const formRef = ref(null);
    const showSnackbar = inject("showSnackbar");
    const select = ref("");
    const selected = ref("");

    const getFormData = async (data) => {
      try {
        await store.dispatch("resources/AddResources", data);
      } catch (error) {
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


    return {
      handleSelectedOption,
      getFormData,
      select,
      selected,
      formRef
    };
  },
};
</script>

<style scoped></style>

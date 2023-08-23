<template>
  <v-container class="my-12" fluid>
    <v-sheet width="300" class="mx-auto">
      <v-form ref="formRef">

        <v-select
          v-model="select"
          :items="items"
          :rules="[(v) => !!v || 'Item is required']"
          label="Item"
          required
          @change="onItemChange($event)"
          return-object
        ></v-select>

        <Pearl v-if="select === 'Pearl'" />

        <v-checkbox
          v-model="checkbox"
          :rules="[(v) => !!v || 'You must agree to continue!']"
          label="Do you agree?"
          required
        ></v-checkbox>

        <div class="d-flex flex-column">
          <v-btn color="success" class="mt-4" block @click="validate">
            Submit
          </v-btn>

          <v-btn color="error" class="mt-4" block @click="resetValidation">
            Reset
          </v-btn>
        </div>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script>
import { ref, onUpdated } from "vue";
import Pearl from '../components/AddResources/Pearl.vue'
export default {
  components: {
    Pearl
  },
  setup() {
    const formRef = ref(null);

    const resetValidation = () => {
      if (formRef.value) {
        formRef.value.reset();
        formRef.value.resetValidation();
      }
    };

    const items = ["Pearl", "PreciousMetal", "Gemstone", "LinkingPart"];
    const nameRules = ref("");
    const validate = ref("");
    const select = ref("");
    const checkbox = ref(false);
    const reset = ref("");
    const rules = ref("");

    const onItemChange = (e) => {
      console.log(e);
    }

    return {
      onItemChange,
      formRef,
      resetValidation,
      nameRules,
      checkbox,
      select,
      validate,
      items,
      reset,
      rules,
    };
  },
};
</script>

<style scoped></style>

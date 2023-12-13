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
          <Metal v-if="selected === 'Metal'" />
          <PreciousStone v-if="selected === 'PreciousStone'" />
          <SemiPreciousStone v-if="selected === 'SemiPreciousStone'" />
          <Element v-if="selected === 'Element'" />

          <div v-if="selected" class="d-flex flex-column">
            <form-buttons @reset-form="resetForm" />
          </div>
        </v-form>
      </v-sheet>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, inject } from "vue";
import Pearl from "@/components/Form/Pearl.vue";
import Metal from "@/components/Form/Metal.vue";
import PreciousStone from "@/components/Form/PreciousStone.vue";
import Element from "@/components/Form/Element.vue";
import SemiPreciousStone from "@/components/Form/SemiPreciousStone.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const props = defineProps({
  id: String,
});
const store = useStore();
const route = useRoute();
const router = useRouter();
const options = ref([
  "Pearl",
  "Metal",
  "Element",
  "PreciousStone",
  "SemiPreciousStone",
]);
const pageTitle = ref(route.meta.title);
const resourceDetails = computed(
  () => store.getters["resources/getResourceDetails"]
);
const snackbarProvider = inject("snackbarProvider");
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
    snackbarProvider.showSuccessSnackbar("Successfully edited resource!");
    router.push("/resources");
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};

const createResource = async () => {
  try {
    await store.dispatch("resources/createResource", resourceDetails.value);
    snackbarProvider.showSuccessSnackbar("Successfully created resource!");
    router.push("/resources");
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};
</script>

<style scoped></style>

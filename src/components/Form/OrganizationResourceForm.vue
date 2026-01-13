<template>
  <v-sheet width="300" class="mx-auto">
    <div class="mx-auto text-center" style="font-size: 24px">
      {{ pageTitle }}
    </div>

    <v-form @submit.prevent="handleSubmit" ref="form" class="mt-4">
      <OrganizationSelect
        :selectedValue="selectedOrg"
        :items="allOrgsByUser"
        :disabled="isRouteRemove"
        @organization-changed="updateSelectedOrg"
      />

      <v-text-field
        v-model="quantity"
        label="Quantity"
        :rules="numberFieldRules"
        required
      ></v-text-field>

      <v-text-field
        v-if="!isRouteTransfer && !isRouteRemove"
        prefix="€"
        label="Delivery Cost"
        v-model="dealPrice"
        :rules="numberFieldRules"
        required
      ></v-text-field>
      <form-buttons @reset-form="resetForm" />
    </v-form>
  </v-sheet>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, computed, onMounted } from "vue";
import { useNumberFieldRules } from "../../utils/validation-rules";
import { useRoute } from "vue-router";
import OrganizationSelect from "@/components/Select/OrganizationSelect.vue";

const emits = defineEmits(["handle-submit"]);
const form = ref(null);
const store = useStore();
const route = useRoute();
const pageTitle = ref(route.meta.title);
const numberFieldRules = useNumberFieldRules();
const selectedUser = ref("");
const quantity = ref("");
const dealPrice = ref("");
const allOrgsByUser = computed(() => store.getters["organizations/getOrgs"]);
const selectedOrg = ref(allOrgsByUser.value.at(0));
const isRouteTransfer = route.path.includes("/transfer");
const isRouteRemove = route.path.includes("/remove");

onMounted(() => {
  if (isRouteRemove || isRouteTransfer) quantity.value = route.params.quantity;
  if (isRouteRemove) setCurrentOrgInTheList();
  if (isRouteTransfer) removeCurrentOrgFromList();
});

const updateSelectedOrg = (newOrg) => {
  if (newOrg) {
    selectedOrg.value = newOrg;
  }
};

const handleSubmit = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  const data = {
    organizationId: isRouteRemove
      ? selectedOrg.value[0].id
      : selectedOrg.value.id,
    userId: selectedUser.value.id,
    quantity: quantity.value,
    dealPrice: Number(dealPrice.value).toFixed(2),
  };

  emits("handle-submit", data);
};

const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
  }
};

const removeCurrentOrgFromList = () => {
  const organizationId = route.params.organizationId;
  const indexToRemove = allOrgsByUser.value.findIndex(
    (x) => x.id === organizationId
  );
  if (indexToRemove !== -1) {
    allOrgsByUser.value.splice(indexToRemove, 1);
  }
};

const setCurrentOrgInTheList = () => {
  selectedOrg.value = allOrgsByUser.value.filter(
    (x) => x.id === route.params.organizationId
  );
};
</script>

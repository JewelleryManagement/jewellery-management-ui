<template>
  <v-sheet width="300" class="mx-auto">
    <div class="mx-auto text-center" style="font-size: 24px">
      {{ pageTitle }}
    </div>

    <v-form @submit.prevent="handleSubmit" ref="form" class="mt-4">
      <v-select
        label="Select organization"
        :items="allOrgsByUser"
        :item-props="orgsPropsFormatter"
        v-model="selectedOrg"
        required
        :rules="[validateOrgs]"
      >
      </v-select>

      <v-text-field
        v-model="quantity"
        label="Quantity"
        :rules="numberFieldRules"
        required
      ></v-text-field>

      <v-text-field
        v-if="!isRouteTransfer"
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
import { orgsPropsFormatter } from "@/utils/data-formatter";
import { useStore } from "vuex";
import { ref, computed } from "vue";
import { useNumberFieldRules, validateOrgs } from "../../utils/validation-rules";
import { useRoute } from "vue-router";
const store = useStore();
const route = useRoute();
const numberFieldRules = useNumberFieldRules();
const selectedUser = ref("");
const selectedOrg = ref("");
const quantity = ref("");
const dealPrice = ref("");

const allUsers = computed(() => store.getters["users/allUsers"]);
const allOrgsByUser = computed(() => store.getters["organizations/getUserOrgs"])
const isRouteTransfer = route.path.includes("/transfer")

if (route.path.includes("/remove")) {
  const resourceId = route.params.resourceId;
  const affectedUserId = route.params.userId;

  const affectedUser = computed(() =>
    store.getters["users/getUserById"](affectedUserId)
  ).value;

  selectedUser.value = affectedUser;

  const resourceAvailability = await fetchResourceAvailability(resourceId);

  const quantityByUser = findQuantityByUser(
    resourceAvailability,
    affectedUser.id
  );
  quantity.value = quantityByUser;
}

async function fetchResourceAvailability(resourceId) {
  const resourceAvailability = ref({});
  resourceAvailability.value = await store.dispatch(
    "resources/fetchAvailabilityResourceById",
    resourceId
  );
  return resourceAvailability.value;
}

function findQuantityByUser(resourceAvailability, userId) {
  return resourceAvailability.usersAndQuantities.find(
    (item) => item.owner.id === userId
  ).quantity;
}

const pageTitle = ref(route.meta.title);
const form = ref(null);

const emits = defineEmits(["handle-submit"]);

const handleSubmit = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  const data = {
    organizationId: selectedOrg.value.id,
    userId: selectedUser.value.id,
    quantity: quantity.value,
    dealPrice: Number(dealPrice.value).toFixed(2)
  };

  emits("handle-submit", data);
};

const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
  }
};
</script>

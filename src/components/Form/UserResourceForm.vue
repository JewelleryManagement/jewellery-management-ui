<template>
  <v-sheet width="300" class="mx-auto">
    <div class="mx-auto text-center" style="font-size: 24px">
      {{ pageTitle }}
    </div>

    <v-form @submit.prevent="handleSubmit" ref="form" class="mt-4">
      <v-select
        label="Select user"
        :items="userOptions"
        v-model="selectedUser"
        :disabled="route.path.includes('/remove')"
      >
      </v-select>

      <v-text-field
        v-model="quantity"
        label="Quantity"
        :rules="numberFieldRules"
        required
      ></v-text-field>

      <form-buttons @reset-form="resetForm" />
    </v-form>
  </v-sheet>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, computed } from "vue";
import { useNumberFieldRules } from "../../utils/validation-rules";
import { useRoute } from "vue-router";
const store = useStore();
const route = useRoute();
const numberFieldRules = useNumberFieldRules();
const selectedUser = ref("");
const quantity = ref("");

const userOptions = computed(() =>
  store.getters["users/allUsers"].map((user) => user.firstName)
);

if (route.path.includes("/remove")) {
  const resourceId = route.params.resourceId;
  const affectedUserId = route.params.userId;
  
  const affectedUser = computed(() =>
    store.getters["users/getUserById"](affectedUserId)
  ).value;

  selectedUser.value = affectedUser.firstName;

  const resourceAvailability = await fetchResourceAvailability(resourceId);
  
  const quantityByUser = findQuantityByUser(resourceAvailability, affectedUser.id);
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
  const data = {
    selectedUser: selectedUser.value,
    quantity: quantity.value,
  };

  if (!valid) return;
  emits("handle-submit", data);
};

const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
  }
};
</script>

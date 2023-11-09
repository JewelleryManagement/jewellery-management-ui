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

      <div class="d-flex flex-column">
        <v-btn color="success" class="mt-4" block type="submit">Submit</v-btn>
        <v-btn color="error" class="mt-4" block @click="resetForm">Reset</v-btn>
        <v-btn color="warning" class="mt-4" block @click="router.go(-1)"
          >Go Back</v-btn
        >
      </div>
    </v-form>
  </v-sheet>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, computed } from "vue";
import { useNumberFieldRules } from "../../utils/validation-rules";
import { useRoute, useRouter } from "vue-router";
const store = useStore();
const route = useRoute();
const router = useRouter();
const numberFieldRules = useNumberFieldRules();
const selectedUser = ref("");
const quantity = ref("");

const userOptions = computed(() =>
  store.getters["users/allUsers"].map((user) => user.name)
);

if (route.path.includes("/remove")) {
  const resourceId = route.params.resourceId;
  const requestedUserId = route.params.userId;
  const loggedUserDetails = computed(() =>
    store.getters["users/getUserById"](requestedUserId)
  ).value;
  selectedUser.value = loggedUserDetails.name;
  const resourceAvailability = ref({});

  resourceAvailability.value = await store.dispatch(
    "resources/fetchAvailabilityResourceById",
    resourceId
  );
  const quantityByUser = resourceAvailability.value.usersAndQuantities.find(
    (item) => item.owner.id === loggedUserDetails.id
  ).quantity;
  quantity.value = quantityByUser;
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

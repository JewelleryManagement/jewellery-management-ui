<template>
  <v-sheet width="300" class="mx-auto">
    <OrganizationSelect
      :items="allOrgsByUser"
      :selectedValue="selectedOrg"
      @organization-changed="updateSelectedOrg"
      :disabled="isOrgSelectDisabled"
    />
    <UserSelect
      :userOptions="allUsers"
      v-model:selectedUser="selectedUser"
      @update:selectedUser="handleSelectedUserChange"
      :disabled="isUserSelectDisabled"
    />
    <OptionsPicker
      :allOptions="allPermissions"
      v-model:chosenOptions="chosenPermissions"
      @update:chosenOptions="handleChosenPermissionsChange"
    />
    <v-btn color="success" class="mt-4" block @click="handleSubmit"
      >Add user</v-btn
    >
  </v-sheet>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import OrganizationSelect from "@/components/Select/OrganizationSelect.vue";
import UserSelect from "@/components/Select/UserSelect.vue";
import OptionsPicker from "@/components/Select/OptionsPicker.vue";
import { useUsersStore } from "@/store/users";
import { useOrganizationsStore } from "@/store/organizations";

const route = useRoute();
const emit = defineEmits(["update:selectedUser", "update:chosenPermissions"]);
const props = defineProps({
  chosenPermissions: {
    type: Array,
    required: false,
    default: [],
  },
  selectedOrg: {
    type: Object,
    required: false,
    default: null,
  },
  selectedUser: {
    type: Object,
    required: false,
    default: null,
  },
  submitRequestFunction: {
    type: Function,
    required: true,
  },
});

const selectedOrg = ref(props.selectedOrg);
const selectedUser = computed({
  get: () => props.selectedUser,
  set: (value) => handleSelectedUserChange(value),
});
const organizationsStore = useOrganizationsStore();
const usersStore = useUsersStore();
const isOrgSelectDisabled = ref(!!props.selectedOrg);
const isUserSelectDisabled = ref(route.path.includes("edit-user"));

const allOrgsByUser = computed(() => organizationsStore.organizations);
const allPermissions = computed(() => organizationsStore.userPermissions);
const chosenPermissions = computed({
  get: () => props.chosenPermissions,
  set: (value) => handleChosenPermissionsChange(value),
});
const allUsers = ref([]);
onMounted(async () => {
  if (props.selectedOrg) {
    await getUsersOutsideOrg(selectedOrg.value);
  }
});
const updateSelectedOrg = async (newOrg) => {
  if (newOrg) {
    selectedOrg.value = newOrg;
    selectedUser.value = null;
    await getUsersOutsideOrg(selectedOrg.value);
  }
};
const handleChosenPermissionsChange = (newChosenOptions) => {
  emit("update:chosenPermissions", newChosenOptions);
};
const handleSelectedUserChange = (newUser) => {
  emit("update:selectedUser", newUser);
};

const getUsersOutsideOrg = async (organization) => {
  const usersInOrganization = await usersStore.fetchUsersByOrganization(
    organization?.id,
  );
  const fetchedAllUsers = computed(() => usersStore.users);
  allUsers.value = fetchedAllUsers.value.filter((user) => {
    const indexOfMatch = usersInOrganization.members.findIndex(
      (member) => member.user.id === user.id,
    );
    return indexOfMatch == -1;
  });
  return allUsers.value;
};

const handleSubmit = async () => {
  let addUserResponse = await props.submitRequestFunction();
};
</script>

<style lang="scss" scoped></style>

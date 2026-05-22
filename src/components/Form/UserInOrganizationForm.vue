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
    <v-autocomplete
      v-if="permissionsStore.canAssignRoles(selectedOrg.id)"
      v-model="selectedRolesModel"
      :items="roles"
      item-title="name"
      return-object
      label="Select roles"
      multiple
      chips
      closable-chips
      clearable
      class="mt-4"
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
import { useUsersStore } from "@/store/users";
import { useOrganizationsStore } from "@/store/organizations";
import { getRolesByType } from "@/services/HttpClientService";
import { usePermissionsStore } from "@/store/permissions";

const route = useRoute();
const emit = defineEmits([
  "update:selectedUser",
  "update:chosenPermissions",
  "update:selectedRoles",
]);
const props = defineProps({
  selectedRoles: {
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
const selectedRolesModel = computed({
  get: () => props.selectedRoles,
  set: (value) => emit("update:selectedRoles", value),
});

const organizationsStore = useOrganizationsStore();
const usersStore = useUsersStore();
const permissionsStore = usePermissionsStore();
const isOrgSelectDisabled = ref(!!props.selectedOrg);
const isUserSelectDisabled = ref(route.path.includes("edit-user"));

const allOrgsByUser = computed(() => organizationsStore.organizations);
const allUsers = ref([]);
const roles = await getRolesByType("ORGANIZATION");

onMounted(async () => {
  if (props.selectedOrg) {
    await getUsersOutsideOrg(selectedOrg.value);
  }
  await permissionsStore.fetchCurrentUserPermissions(props.selectedOrg.id);
});
const updateSelectedOrg = async (newOrg) => {
  if (newOrg) {
    selectedOrg.value = newOrg;
    selectedUser.value = null;
    await getUsersOutsideOrg(selectedOrg.value);
  }
};
const handleSelectedUserChange = (newUser) => {
  emit("update:selectedUser", newUser);
};

const getUsersOutsideOrg = async (organization) => {
  await usersStore.fetchUsers();
  const usersInOrganization = await usersStore.fetchUsersByOrganization(
    organization?.id,
  );
  const fetchedAllUsers = computed(() => usersStore.users);
  allUsers.value = fetchedAllUsers.value.filter((user) => {
    const indexOfMatch = usersInOrganization.findIndex(
      (member) => member.user.id === user.id,
    );
    return indexOfMatch == -1;
  });
  return allUsers.value;
};

const handleSubmit = async () => {
  await props.submitRequestFunction({
    organization: selectedOrg.value,
    user: selectedUser.value,
    roles: selectedRolesModel.value,
    canAssignRoles: permissionsStore.canAssignRoles(props.selectedOrg.id),
  });
};
</script>

<style lang="scss" scoped></style>

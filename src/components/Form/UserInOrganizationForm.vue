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
import { ref, computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import OrganizationSelect from "@/components/Select/OrganizationSelect.vue";
import UserSelect from "@/components/Select/UserSelect.vue";
import OptionsPicker from "@/components/Select/OptionsPicker.vue";

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
const selectedUser = ref(props.selectedUser);
const store = useStore();
const isOrgSelectDisabled = ref(!!props.selectedOrg);
const isUserSelectDisabled = ref(!!props.selectedUser);

const allOrgsByUser = computed(() => store.getters["organizations/getOrgs"]);
const allPermissions = computed(
  () => store.getters["organizations/getUserPermissions"]
);
const chosenPermissions = ref(props.chosenPermissions);
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
  emit("update:chosenPermissions", chosenPermissions.value);
};

watch(selectedUser, (newUser) => {
  emit("update:selectedUser", newUser);
});

const getUsersOutsideOrg = async (organization) => {
  const usersInOrganization = await store.dispatch(
    "users/fetchUsersByOrganization",
    organization?.id
  );
  const fetchedAllUsers = computed(() => store.getters["users/getAllUsers"]);
  allUsers.value = fetchedAllUsers.value.filter((user) => {
    const indexOfMatch = usersInOrganization.members.findIndex(
      (member) => member.user.id === user.id
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
  
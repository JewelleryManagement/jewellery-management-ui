<template>
  <div class="my-12">
    <div class="text-center">
      <h1>{{ pageTitle }} Table</h1>
    </div>
    <div class="d-flex flex-wrap ga-2 ml-4">
      <v-btn
        v-if="isRolesPage"
        v-for="type in ['organization', 'system']"
        :key="type"
        color="red"
        rounded="xs"
        :variant="roleType === type ? 'flat' : 'outlined'"
        :to="`/roles/${type}`"
      >
        {{ type === "organization" ? "Organization Roles" : "System Roles" }}
      </v-btn>
    </div>
    <div v-if="isRolesPage" class="d-flex justify-end">
      <table-button
        v-if="permissionsStore.canCreateSystemRoles"
        :path="`/roles/${roleType}/create`"
      >
        Create Role
      </table-button>
    </div>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="columns"
      :items="roles"
      :search="search"
      @click:row="navigateToItemPage"
      hover
    >
      <template #item.permissions="{ item }">
        <PermissionsTooltip
          :permissions="extractDirectPermissions(item.permissions)"
        />
      </template>
      <template v-if="isRolesPage" v-slot:item.actions="{ item }">
        <div @click.stop>
          <IconButton
            v-if="permissionsStore.canDeleteSystemRoles"
            icon="mdi-delete"
            name="Delete"
            color="red"
            @click="onDelete(item.id)"
          />
        </div>
      </template>
    </v-data-table>
  </div>
</template>
<script setup>
import { computed, ref, watch, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import TableButton from "../Button/TableButton.vue";
import { useRolesStore } from "@/store/roles";
import PermissionsTooltip from "../Tooltip/PermissionsTooltip.vue";
import { navigateToItemDetails } from "@/utils/row-click-handler";
import { usePermissionsStore } from "@/store/permissions.js";
import IconButton from "../Button/IconButton.vue";
import { handleNotFound } from "@/utils/action-guard.js";

const props = defineProps({
  roles: {
    type: Array,
    default: null,
  },
  title: String,
});

const snackbarProvider = inject("snackbarProvider");

const route = useRoute();
const isRolesPage = computed(() => route.path.startsWith("/roles"));

const roleType = computed(() => route.params.type);

const pageTitle = computed(() => {
  if (props.title) {
    return props.title;
  }

  return route.params.type === "organization"
    ? "Organization Roles"
    : "System Roles";
});

const search = ref("");
const router = useRouter();
const rolesStore = useRolesStore();
const permissionsStore = usePermissionsStore();

const localRoles = ref([]);

const roles = computed(() => props.roles ?? localRoles.value);

const extractDirectPermissions = (permissions) => {
  return (permissions || [])?.map((item) => item.permission);
};

const columns = isRolesPage
  ? rolesStore.getTableColumnsWithActions
  : rolesStore.columns;

const navigateToItemPage = (row, item) => {
  const roleId = item.internalItem.key;

  navigateToItemDetails(router, "Role-Details", "id", roleId);
};

const fetchRoles = async () => {
  await permissionsStore.fetchCurrentUserSystemPermissions();

  if (props.roles) return;

  if (
    roleType.value === "organization" &&
    permissionsStore.canReadSystemRoles
  ) {
    localRoles.value = await rolesStore.fetchAllRolesByType("ORGANIZATION");
  } else if (
    roleType.value === "system" &&
    permissionsStore.canReadSystemRoles
  ) {
    localRoles.value = await rolesStore.fetchAllRolesByType("SYSTEM");
  }
};

const onDelete = async (roleId) => {
  const confirmation = window.confirm(
    "Are you sure that you would like to delete this item?",
  );

  if (!confirmation) return;

  try {
    await rolesStore.deleteRoleById(roleId);

    localRoles.value = localRoles.value.filter((role) => role.id !== roleId);

    snackbarProvider.showSuccessSnackbar("Role deleted successfully!");
  } catch (error) {
    if (await handleNotFound(router, error, "Resource")) return;

    snackbarProvider.showErrorSnackbar(
      error?.response?.data?.error || "Failed to delete role",
    );
  }
};

watch(roleType, fetchRoles, { immediate: true });
</script>

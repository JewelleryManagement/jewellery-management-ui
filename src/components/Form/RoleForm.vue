<template>
  <v-form ref="form" @submit.prevent="handleSubmit">
    <v-sheet class="mx-auto pa-4">
      <div class="mx-auto text-center text-h5 mb-4">
        {{ pageTitle }}
      </div>

      <div class="d-flex justify-center mt-10">
        <v-text-field
          v-model="roleName"
          label="Role name"
          clearable
          style="max-width: 500px"
          :rules="rules"
        />
      </div>

      <div class="text-center text-h6 mt-6 mb-3">Permissions</div>

      <div class="d-flex justify-center mt-8">
        <v-row class="flex-nowrap overflow-x-auto justify-center">
          <v-col
            v-for="(items, group) in groupedPermissions"
            :key="group"
            cols="auto"
          >
            <div class="text-subtitle-1 font-weight-bold mb-2 pl-2">
              {{ group }}
            </div>

            <v-checkbox
              v-for="item in items"
              :key="item.permission"
              :model-value="
                effectiveSelectedPermissions.includes(item.permission)
              "
              :disabled="autoIncludedPermissions.has(item.permission)"
              hide-details
              density="comfortable"
              @update:model-value="togglePermission(item.permission, $event)"
            >
              <template #label>
                <div class="d-flex align-center">
                  <span>{{ getPermissionName(item.permission) }}</span>

                  <v-tooltip v-if="item.included?.length" location="top">
                    <template #activator="{ props }">
                      <v-icon
                        v-bind="props"
                        size="16"
                        class="ml-2"
                        color="grey-darken-1"
                      >
                        mdi-information
                      </v-icon>
                    </template>

                    <div>
                      <div class="text-caption font-weight-bold mb-1">
                        Includes:
                      </div>
                      <div
                        v-for="included in item.included"
                        :key="included"
                        class="text-caption"
                      >
                        • {{ getPermissionName(included) }}
                      </div>
                    </div>
                  </v-tooltip>
                </div>
              </template>
            </v-checkbox>
          </v-col>
        </v-row>
      </div>
      <div class="d-flex justify-center mt-8">
        <div style="width: 300px">
          <form-buttons type="submit" @reset-form="resetForm" />
        </div>
      </div>
    </v-sheet>
  </v-form>
</template>

<script setup>
import { computed, ref, inject, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import FormButtons from "../Button/FormButtons.vue";
import { useInputValidate, useTextFieldRules } from "@/utils/validation-rules";
import { useRolesStore } from "@/store/roles";
import { usePermissionsStore } from "@/store/permissions";

const form = ref(null);
const rules = [...useInputValidate(), ...useTextFieldRules()];
const snackbarProvider = inject("snackbarProvider");
const route = useRoute();
const router = useRouter();
const roleName = ref("");
const rolesStore = useRolesStore();
const permissionsStore = usePermissionsStore();

const roleType = computed(() => route.params.type);

const isOrganizationRole = computed(() => roleType.value === "organization");

const pageTitle = computed(() =>
  isOrganizationRole.value ? "Create Organization Role" : "Create System Role",
);

const directSelectedPermissions = ref([]);

const permissions = ref([]);

const fetchPermissions = async () => {
  permissions.value = [];
  directSelectedPermissions.value = [];

  if (roleType.value === "organization") {
    permissions.value = await rolesStore.fetchAllPermissionsByRoleType(
      "ORGANIZATION",
    );
    return;
  } else
    permissions.value = await rolesStore.fetchAllPermissionsByRoleType(
      "SYSTEM",
    );
};

watch(roleType, fetchPermissions, { immediate: true });

const permissionFormats = permissionsStore.permissionFormats;

const permissionMap = computed(() => {
  const map = {};

  for (const item of permissions.value) {
    map[item.permission] = item.included ?? [];
  }

  return map;
});

const effectiveSelectedPermissions = computed(() => {
  const expanded = new Set();

  for (const permission of directSelectedPermissions.value) {
    expanded.add(permission);

    const includedPermissions = permissionMap.value[permission] || [];
    for (const included of includedPermissions) {
      expanded.add(included);
    }
  }

  return Array.from(expanded);
});

const autoIncludedPermissions = computed(() => {
  const autoIncluded = new Set();

  for (const permission of directSelectedPermissions.value) {
    const includedPermissions = permissionMap.value[permission] || [];

    for (const included of includedPermissions) {
      if (!directSelectedPermissions.value.includes(included)) {
        autoIncluded.add(included);
      }
    }
  }

  return autoIncluded;
});

const groupedPermissions = computed(() => {
  const groups = {};

  for (const item of permissions.value) {
    const group = getPermissionGroup(item.permission);

    if (!groups[group]) {
      groups[group] = [];
    }

    groups[group].push(item);
  }

  for (const group in groups) {
    groups[group].sort((a, b) =>
      getPermissionName(a.permission).localeCompare(
        getPermissionName(b.permission),
      ),
    );
  }

  return groups;
});

const togglePermission = (permission, checked) => {
  if (checked) {
    if (!directSelectedPermissions.value.includes(permission)) {
      directSelectedPermissions.value = [
        ...directSelectedPermissions.value,
        permission,
      ];
    }
    return;
  }

  directSelectedPermissions.value = directSelectedPermissions.value.filter(
    (item) => item !== permission,
  );
};

const getPermissionName = (permission) =>
  permissionFormats[permission]?.name ?? permission;

const getPermissionGroup = (permission) =>
  permissionFormats[permission]?.group ?? "Other";

const apiRoleType = computed(() =>
  isOrganizationRole.value ? "ORGANIZATION" : "SYSTEM",
);

const buildPayload = () => ({
  name: roleName.value,
  roleType: apiRoleType.value,
  permissions: directSelectedPermissions.value,
});

const resetForm = () => {
  roleName.value = "";
  directSelectedPermissions.value = [];
};

const handleSubmit = async () => {
  const { valid } = await form.value.validate();

  if (!valid) {
    return;
  }

  if (directSelectedPermissions.value.length === 0) {
    snackbarProvider.showErrorSnackbar("Choose at least one permission");
    return;
  }

  try {
    const payload = buildPayload();
    await rolesStore.createRole(payload);
    snackbarProvider.showSuccessSnackbar(
      `Role ${roleName.value} created successfully`,
    );
    resetForm();
    router.push(`/roles/${roleType.value}`);
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};
</script>

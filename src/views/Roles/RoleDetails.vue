<template>
  <v-container class="pa-6 d-flex justify-center">
    <v-card
      v-if="role"
      rounded="xl"
      elevation="2"
      style="max-width: 800px; width: 100%"
    >
      <v-card-title class="text-h5 font-weight-bold text-center">
        {{ role.name }}
      </v-card-title>

      <v-card-subtitle class="d-flex justify-center mt-2">
        <v-chip color="primary" variant="flat">
          {{ role.roleType }}
        </v-chip>
      </v-card-subtitle>

      <v-card-text class="mt-4">
        <div class="text-h6 mb-4">Permissions</div>
        <v-treeview :items="treeItems" item-value="value" open-all />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRolesStore } from "@/store/roles";
import { usePermissionsStore } from "@/store/permissions";

const rolesStore = useRolesStore();
const permissionsStore = usePermissionsStore();
const role = ref(rolesStore.selectedRole);
const permissionFormats = permissionsStore.permissionFormats;

const treeItems = computed(() =>
  (role.value?.permissions || []).map((permissionNode) => ({
    title: permissionFormats[permissionNode.permission]?.name,
    value: permissionNode.permission,
    rawPermission: permissionNode.permission,
    children: (permissionNode.included || []).map((includedPermission) => ({
      title: permissionFormats[includedPermission]?.name,
      value: `${permissionNode.permission}-${includedPermission}`,
      rawPermission: includedPermission,
    })),
  })),
);
</script>

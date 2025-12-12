<template>
  <v-sheet width="300" class="mx-auto">
    <v-autocomplete
      v-model="selectedUser"
      :items="users"
      :search-input.sync="search"
      label="Select a user"
      :item-props="userPropsFormatter"
      :loading="loading"
      no-data-text="No users found"
      hide-details
      :disabled="disabled"
    ></v-autocomplete>
  </v-sheet>
</template>
  
  <script setup>
import { computed, toRef, ref } from "vue";
import { userPropsFormatter } from "@/utils/data-formatter";

const props = defineProps({
  userOptions: {
    type: Array,
    required: true,
  },
  selectedUser: {
    type: Object,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:selectedUser"]);

const selectedUser = computed({
  get: () => props.selectedUser,
  set: (value) => emit("update:selectedUser", value),
});
const users = toRef(props, "userOptions");
const search = ref("");
const loading = ref(false);
</script>
  
  <style lang="scss" scoped></style>
  
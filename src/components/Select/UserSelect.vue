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
    ></v-autocomplete>
  </v-sheet>
</template>
  
  <script setup>
import { toRef, ref, watch } from "vue";
import { userPropsFormatter } from "@/utils/data-formatter";

const props = defineProps({
  userOptions: {
    type: Array,
    required: true,
  },
  selectedUser: {
    type: [String, Number],
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:selectedUser"]);

const selectedUser = ref(props.selectedUser);
const users = toRef(props, "userOptions");
const search = ref("");
const loading = ref(false);

watch(selectedUser, (newValue) => {
  emit("update:selectedUser", newValue);
});
</script>
  
  <style lang="scss" scoped></style>
  
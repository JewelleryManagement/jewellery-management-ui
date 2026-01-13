<template>
  <div>
    <div class="text-center">
      <h1>{{ title }}</h1>
    </div>
    <div class="d-flex justify-end">
      <table-button :path="headBtnPath">{{ headBtnName }}</table-button>
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

    <!-- TODO: Extract -->
    <v-data-table
      :headers="tableColumns"
      :items="tableUsers"
      :search="search"
      @click:row="rowClickHandler"
      hover
    >
      <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope || {}" />
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { navigateToItemDetails } from "@/utils/row-click-handler";
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const props = defineProps({
  title: String,
  users: Array,
  columns: Array,
  headBtnPath: String,
  headBtnName: String,
});
const store = useStore();
const search = ref("");
const router = useRouter();
const headBtnPath = ref(props.headBtnPath ?? "/users/create");
const headBtnName = ref(props.headBtnName ?? "Create user");
const allUsers = computed(() => store.getters["users/getAllUsers"]);
const tableUsers = computed(() =>
  props.users?.length > 0 ? props.users : allUsers.value
);
const defaultColumnsWithEdit = computed(
  () => store.getters["users/getTableColumnsWithEdit"]
);
const tableColumns = computed(() =>
  props.columns ? props.columns : defaultColumnsWithEdit.value
);

watch(
  () => props.users,
  (newUsers) => {
    tableUsers.value = newUsers;
  }
);

const rowClickHandler = (user) => {
  navigateToItemDetails(router, user, "users");
};
</script>

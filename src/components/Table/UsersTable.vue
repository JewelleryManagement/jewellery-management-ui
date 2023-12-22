<template>
  <div>
    <div class="text-center">
      <h1>{{ title }}</h1>
    </div>
    <div class="d-flex justify-end">
      <table-button path="/users/create">Create user</table-button>
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
      :headers="tableColumns"
      :items="allUsers"
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const { title } = defineProps({ title: String });
const store = useStore();
const search = ref("");
const router = useRouter();

const allUsers = computed(() => store.getters["users/allUsers"]);
const tableColumns = computed(() => store.getters["users/getTableColumnsWithEdit"]);

const rowClickHandler = (user) => {
  navigateToItemDetails(router, user, "users");
};
</script>

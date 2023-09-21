<template>
  <v-container class="my-12" fluid>
    <v-row justify="center">
      <v-col cols="10" max-width="1600">
        <v-card class="elevation-12">
          <div class="text-center">
            <h1>Resources table</h1>
          </div>
          <div class="d-flex justify-space-between">
            <v-menu open-on-hover>
              <template v-slot:activator="{ props }">
                <v-btn
                variant="outlined"
                  class="mx-4"
                  rounded="xs"
                  :size="isSmAndDown ? 'small' : 'x-large'"
                  color="red"
                  v-bind="props"
                >
                  Sorting
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in items"
                  :key="index"
                  :value="index"
                >
                  <v-list-item-title @click="clickHandler(item.title)">{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-btn
              class="mx-4"
              rounded="xs"
              :size="isSmAndDown ? 'small' : 'x-large'"
              color="red"
              to="/resources/add"
              >Add resource</v-btn
            >
          </div>

          <resource-table :sortChoice="sortChoice"></resource-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { onMounted, inject, ref, computed } from "vue";
import ResourceTable from "@/components/Table/ResourceTable.vue";
import { useStore } from "vuex";
import { useDisplay } from "vuetify/lib/framework.mjs";

export default {
  components: {
    ResourceTable,
  },
  setup() {
    const store = useStore();
    const snackbarProvider = inject("snackbarProvider");
    const mobile = useDisplay();
    const sortChoice = ref("All");

    const clickHandler = (title) => {
      sortChoice.value = title;
    };

    onMounted(async () => {
      try {
        await store.dispatch("resources/fetchResources");
      } catch (error) {
        snackbarProvider.showErrorSnackbar("Failed to fetch resources.");
      }
    });

    return {
      isSmAndDown: computed(() => {return mobile.smAndDown.value}),
      clickHandler,
      sortChoice,
      items: [
        { title: "All" },
        { title: "Pearl" },
        { title: "LinkingPart" },
        { title: "Gemstone" },
        { title: "PreciousMetal" },
      ],
    };
  },
};
</script>

<style scoped></style>

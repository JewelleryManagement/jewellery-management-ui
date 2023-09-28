<template>
  <v-container class="my-12" fluid>
    <v-row justify="center">
      <v-col cols="10" max-width="1600">
        <v-card class="elevation-12">
          <v-container class="text-center text-h4 font-weight-bold">
            {{
              selectedResourceType === "All"
                ? "All resources table"
                : `${selectedResourceType}'s resources table`
            }}
          </v-container>
          <div class="d-flex justify-space-between">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  variant="outlined"
                  class="mx-4"
                  rounded="xs"
                  :size="isSmAndDown ? 'small' : 'x-large'"
                  color="red"
                  v-bind="props"
                >
                  Resource Type
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="resourceType in resourceTypes"
                  :key="resourceType"
                  :value="resourceType"
                >
                  <v-list-item-title
                    @click="filterResourcesByType(resourceType)"
                    >{{ resourceType }}</v-list-item-title
                  >
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

          <resource-table
            :selectedResourceType="selectedResourceType"
          ></resource-table>
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
    const selectedResourceType = ref("All");

    const filterResourcesByType = (title) => {
      selectedResourceType.value = title;
    };

    onMounted(async () => {
      try {
        await store.dispatch("resources/fetchResources");
      } catch (error) {
        snackbarProvider.showErrorSnackbar("Failed to fetch resources.");
      }
    });

    return {
      isSmAndDown: computed(() => {
        return useDisplay().smAndDown.value;
      }),
      filterResourcesByType,
      selectedResourceType,
      resourceTypes: [
        "All",
        "Pearl",
        "LinkingPart",
        "Gemstone",
        "PreciousMetal",
      ],
    };
  },
};
</script>

<style scoped></style>

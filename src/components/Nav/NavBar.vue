<template class="navbar">
  <v-navigation-drawer
    v-model="drawer"
    :rail="!isMediumAndDownScreen()"
    :expand-on-hover="hovering"
    :temporary="isMediumAndDownScreen()"
    @mouseenter="hovering = true"
    @mouseleave="
      hovering = false;
      open = [];
    "
  >
    <NavBarHomeButton :size="200" :offset="7" />

    <v-list v-model:opened="open">
      <template v-for="(page, index) in navBarButtons" :key="index">
        <v-list-group v-if="page.children && page.children.length">
          <template v-slot:activator="{ props, isOpen }">
            <v-list-item
              v-bind="props"
              :title="page.link.text"
              :prepend-icon="page.icon"
              :class="{ 'bg-grey-lighten-2': isOpen }"
            />
          </template>

          <v-list-item
            v-for="(child, childIndex) in page.children"
            :key="childIndex"
            :title="child.text"
            link
            @click="handleChildClick(child)"
            :class="{
              'bg-grey-lighten-2': isActive(child),
            }"
          />
        </v-list-group>

        <v-list-item
          v-else
          :title="page.link.text"
          :prepend-icon="page.icon"
          @click="handlePageClick(page)"
          link
        />
      </template>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar :elevation="2" v-if="isMediumAndDownScreen()">
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        @click="
          drawer = !drawer;
          rail = false;
        "
      />
    </template>

    <NavBarHomeButton :size="70" :offset="0" />
  </v-app-bar>

  <div v-if="hovering" class="overlay" @click="hovering = false"></div>
</template>

<script setup>
import { isMediumAndDownScreen } from "@/utils/display";
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
import NavBarHomeButton from "./NavBarHomeButton.vue";

const { navBarButtons } = defineProps({
  navBarButtons: Object,
});

const router = useRouter();
const route = useRoute();
const drawer = ref(!isMediumAndDownScreen());
const hovering = ref(false);
const open = ref([]);

const handlePageClick = (page) => {
  router.push(page.link.url);
  open.value = [];
  hovering.value = false;
};

const handleChildClick = (child) => {
  if (child.action) {
    child.action();
    return;
  }

  router.push({
    path: child.url,
    query: child.query || {},
  });
  open.value = [];
  hovering.value = false;
};

const isActive = (page) => {
  let full = page.url;

  if (page.query) {
    const params = new URLSearchParams(page.query).toString();
    full += `?${params}`;
  }

  return route.fullPath === full;
};
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10;
}
</style>

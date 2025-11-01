<template class="navbar">
  <v-navigation-drawer
    v-model="drawer"
    :rail="!isSmallScreen()"
    expand-on-hover
    :temporary="isSmallScreen()"
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
            @click="handleClick(child)"
            :class="{
              'bg-grey-lighten-2': isActive(child),
            }"
          />
        </v-list-group>

        <v-list-item
          v-else
          :title="page.link.text"
          :prepend-icon="page.icon"
          :to="page.link.url"
          link
        />
      </template>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar :elevation="2" v-if="isSmallScreen()">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
    </template>

    <NavBarHomeButton :size="70" :offset="0" />
  </v-app-bar>

  <div v-if="hovering" class="overlay" @click="hovering = false"></div>
</template>

<script setup>
import { isSmallScreen } from "@/utils/display";
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
import NavBarHomeButton from "./NavBarHomeButton.vue";

const { navBarButtons } = defineProps({
  navBarButtons: Object,
});
const router = useRouter();
const route = useRoute();
const drawer = ref(!isSmallScreen());
const hovering = ref(false);
const open = ref([]);

const handleClick = (child) => {
  if (child.action) {
    child.action();
    return;
  }

  router.push({
    path: child.url,
    query: child.query || {},
  });
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

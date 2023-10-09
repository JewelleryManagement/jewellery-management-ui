<template>
  <v-app-bar app>
    <router-link to="/home">
      <v-img
        class="mx-2"
        src="@/assets/logo.png"
        max-height="240"
        max-width="240"
        min-height="240"
        min-width="240"
        contain
      ></v-img>
    </router-link>

    <v-spacer></v-spacer>

    <v-toolbar-items class="hidden-sm-and-down" v-if="!isSmallScreen">
      <template v-for="(page, index) in defaultMenuPages">
        <v-btn
          v-if="!page.isMenuDropdown"
          :key="index"
          :to="page.link.url"
          text
        >
          {{ page.link.text }}
        </v-btn>

        <v-menu v-if="page.isMenuDropdown" open-on-hover :key="index">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props">{{ page.link.text }}</v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="(item, index) in page.link.dropdown"
              :key="index"
              link
              @click="item.clickHandler"
              >{{ item.text }}
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-toolbar-items>

    <v-menu v-if="isSmallScreen">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon v-bind="props" size="x-large"></v-app-bar-nav-icon>
      </template>

      <v-list>
        <v-list-item
          v-for="(page, index) in hamburgerMenuPages"
          :key="index"
          :to="page.link.url"
          link
          @click="page.clickHandler"
        >
          {{ page.link.text }}
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { computed } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";

export default {
  props: ["defaultMenuPages", "hamburgerMenuPages"],
  setup() {
    const mobile = useDisplay();
    const isSmallScreen = computed(() => {
      return mobile.smAndDown.value;
    });


    return {
      isSmallScreen,
    };
  },
};
</script>

<style></style>
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

    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn
        v-for="(page, index) in pages"
        :key="index"
        :to="{ name: page.link.text }"
        text
      >
        {{ page.link.text }}
      </v-btn>
    </v-toolbar-items>

    <v-menu v-if="smAndDown">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon v-bind="props" size="x-large"></v-app-bar-nav-icon>
      </template>

      <v-list>
        <v-list-item
          v-for="(page, index) in pages"
          :key="index"
          link
          :to="{ name: page.link.text }"
        >
          {{ page.link.text }}
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  props: ["pages"],
  methods: {
    goToPage(pageName) {
      this.$router.push({ name: pageName });
    },
  },
  computed: {
    smAndDown() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>

<style></style>

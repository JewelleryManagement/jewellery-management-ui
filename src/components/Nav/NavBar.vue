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

    <v-btn
      v-for="(page, index) in pages"
      :key="index"
      :to="{ name: page.link.text }"
      text
    >
      {{ page.link.text }}
    </v-btn>
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
};
</script>

<style></style>

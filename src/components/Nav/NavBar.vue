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
        @click="page.link.text === 'Logout' ? logoutHandler() : null"
      >
        {{ page.link.text }}
      </v-btn>
    </v-toolbar-items>

    <v-menu v-if="isSmAndDown">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon v-bind="props" size="x-large"></v-app-bar-nav-icon>
      </template>

      <v-list>
        <v-list-item
          v-for="(page, index) in pages"
          :key="index"
          link
          :to="{ name: page.link.text }"
          @click="page.link.text === 'Logout' ? logoutHandler() : null"
        >
          {{ page.link.text }}
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { computed, ref, inject } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  props: ["pages"],
  setup() {
    const store = useStore()
    const router = useRouter()
    const snackbarProvider = inject("snackbarProvider");
    const mobile = useDisplay();
    const isSmAndDown = computed(() => {
      return mobile.smAndDown.value;
    });

    const logoutHandler = () => {
      console.log('here');
      store.dispatch('auth/logout')
      snackbarProvider.showSuccessSnackbar('Logged out successfully!')
      router.push('/login')
    }

    return {
      logoutHandler,
      isSmAndDown,
    };
  },
};
</script>

<style></style>

<template>
  <v-container class="my-16">
    <v-card>
      <div class="block text-center notFound">
        <h2>Page not found</h2>
        <i class="fas fa-exclamation-triangle red--text"></i>
        <p>
          We're sorry, the page you requested could not be found. Please go back
          to the homepage or contact us back for more information.
        </p>

        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="() => router.go(-1)">Go Back</v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()

</script>

<style scoped></style>

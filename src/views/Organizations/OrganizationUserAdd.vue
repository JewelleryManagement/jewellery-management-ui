<template>
  <UserInOrganizationForm/>
</template>
  
<script setup>
import UserInOrganizationForm from "@/components/Form/UserInOrganizationForm.vue";
import { ref, inject, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
</script>
  
<style scoped></style>
  
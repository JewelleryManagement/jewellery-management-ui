<template>
    <div>
      <strong>{{ title }}</strong>
      <div>Name: {{ organization.name }}</div>
      <div>Address: {{ organization.address }}</div>
    </div>
  </template>
  
  <script setup>
  const { title, organization } = defineProps({
    title: String,
    organization: Object,
  });
  </script>
  
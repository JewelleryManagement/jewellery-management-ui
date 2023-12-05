<template>
  <div>
    <strong>{{title}}</strong>
    <div>Name: {{ participant.firstName }} {{ participant.lastName }}</div>
    <div>Email: {{ participant.email }}</div>
  </div>
</template>

<script setup>
const { title, participant } = defineProps({
  title: String,
  participant: Object,
});
</script>

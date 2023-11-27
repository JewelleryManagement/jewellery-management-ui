<template>
  <div>
    <strong>{{title}}</strong>
    <div>Name: {{ participant.name }}</div>
    <div>Email: {{ participant.email }}</div>
  </div>
</template>

<script setup>
const { title, participant } = defineProps({
  title: String,
  participant: Object,
});
</script>

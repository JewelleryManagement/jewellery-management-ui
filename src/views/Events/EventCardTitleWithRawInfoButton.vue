<template>
  <div class="position-relative d-flex align-center px-4 py-2">
    <div class="position-absolute w-100 text-center">
      <span class="text-h6">{{ title }}</span>
    </div>

    <div class="ms-auto">
      <text-button
        color="blue"
        :text="rawDataButton ? 'BACK' : 'RAW'"
        @click="onClick"
      />
    </div>
  </div>
</template>
<script setup>
import TextButton from "@/components/Button/TextButton.vue";
const props = defineProps({
  title: String,
  rawDataButton: Boolean,
});

const emit = defineEmits(["update:rawDataButton"]);

const onClick = () => {
  emit("update:rawDataButton", !props.rawDataButton);
};
</script>

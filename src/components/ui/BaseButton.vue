<template>
  <button v-if="!link" :class="mode">
    <slot></slot>
  </button>
  <router-link v-else :to="to" :class="mode">
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      required: false,
      default: null,
    },
    link: {
      type: Boolean,
      required: false,
      default: false,
    },
    to: {
      type: [String, Object],
      required: false,
      default: "/",
    },
  },
};
</script>

<style scoped>
button,
a {
  text-decoration: none;
  font: inherit;
  color: var(--clr-white);
  background-color: var(--clr-living-coral);
  padding: 0.6rem 1rem;
  border-radius: 0.3rem;
  font-weight: bold;
  border: 1px solid transparent;
  transition: var(--trans);
}

a:hover,
a.active,
button:hover,
button.active {
  border: 1px solid var(--clr-living-coral);
  background-color: #fff;
  color: var(--clr-living-coral);
}

.flat {
  background-color: transparent;
  color: var(--clr-inkwell);
  border: none;
}

.outline {
  background-color: transparent;
  border-color: var(--clr-living-coral);
  color: #270041;
}

.flat:hover,
.flat.active,
.outline:hover,
.outline.active {
  border: 1px solid var(--clr-living-coral);
  background-color: #fff;
  color: var(--clr-living-coral);
}
</style>

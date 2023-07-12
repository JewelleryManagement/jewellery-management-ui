<template>
  <nav>
    <div class="nav__left_side">
      <h3>
        <router-link to="/home">Inventory management</router-link>
      </h3>
    </div>

    <div class="nav__right_side">
      <ul class="nav__list">
        <li class="nav__item" v-for="(page, index) in pages" :key="index">
          <router-link :to="page.link.url" class="nav__link">
            {{ page.link.text }}
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  props: ["pages"],
};
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--clr-inkwell);
}

.nav__left_side a {
  color: var(--clr-living-coral);
  text-decoration: none;
  padding: 1rem;
  font-size: 2rem;
}

.nav__right_side {
  display: flex;
  align-items: center;
}

.nav__list {
  list-style-type: none;
  display: flex;
}

.nav__item {
  margin: 0;
  padding: 0.5rem;
}

.nav__link {
  text-decoration: none;
  color: var(--clr-white);
  background-color: var(--clr-living-coral);
  padding: 0.6rem 1rem;
  border-radius: 0.3rem;
  font-weight: bold;
  border: 1px solid transparent;
  transition: var(--trans);
}

.nav__link:hover,
.nav__link:active {
  border: 1px solid #fff;
}
</style>

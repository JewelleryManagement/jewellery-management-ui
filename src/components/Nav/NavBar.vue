<template>
  <nav>
    <div class="nav__left_side">
      <div class="nav_logo">
        <router-link to="/home">
          <img src="@/assets/logo.png" alt="Inventory logo" />
        </router-link>
      </div>

      <!-- <h3>
        <router-link to="/home">Inventory management</router-link>
      </h3> -->
    </div>

    <div class="nav__right_side">
      <ul class="nav__list">
        <li class="nav__item" v-for="(page, index) in pages" :key="index">
          <base-button link :to="{ name: `${page.link.text}` }">{{
            page.link.text
          }}</base-button>
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
  height: 4.5rem;
}

.nav__left_side a {
  color: var(--clr-living-coral);
  text-decoration: none;
  font-size: 2rem;
  margin-left: 0.5rem;
}

.nav__right_side {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
}

.nav__list {
  list-style-type: none;
  display: flex;
}

.nav__item {
  margin: 0;
  padding: 0.2rem;
}

.nav_logo {
  flex: 1;
}

.nav_logo img {
  margin-top: 5px;
  max-height: 100%;
  width: 145px; 
}

</style>

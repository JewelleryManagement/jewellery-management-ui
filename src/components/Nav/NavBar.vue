<template>
  <nav>
    <div class="nav__left_side">
      <h3>
        <a href="/home" @click.prevent="navLinksClick(0)"
          >Inventory management</a
        >
      </h3>
    </div>

    <div class="nav__right_side">
      <ul class="nav__list">
        <li class="nav__item" v-for="(page, index) in pages"  :key="index">
          <a
            :href="page.link.url"
            class="nav__link"
            @click.prevent="navLinksClick(index)"
            >{{ page.link.text }}</a
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  props: ["pages", "activePage", "navLinksClick"],
};
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50;
}

.nav__left_side a {
  color: red;
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
  color: #fff;
  background-color: red;
  font-weight: bold;
  padding: 0.6rem 1rem;
  border-radius: 0.3rem;
}

.nav__link:active .nav__link:hover {
  color: #000;
}
</style>

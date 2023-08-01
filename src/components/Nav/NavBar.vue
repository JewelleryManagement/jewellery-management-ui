<template>

  <nav>
    <div class="nav__left_side">
      <div class="nav_logo">
        <router-link to="/home">
          <img src="@/assets/logo.png" alt="Inventory logo" />
        </router-link>
      </div>
    </div>

    <div class="nav__right_side">
      <ul class="nav__list">
        <li class="nav__item" v-for="(page, index) in pages" :key="index">
          <base-button link :to="{ name: `${page.link.text}` }">{{
            page.link.text
          }}</base-button>
        </li>
      </ul>

      <div class="drop__down" @click="toggleDropdown">
        <button class="drop__btn">
          <i class="fas fa-bars"></i>
        </button>

        <div class="dropdown__content" :class="{ active: isDropDownActive }">
          <ul>
            <li v-for="(page, index) in pages" :key="index">
              <router-link :to="{ name: `${page.link.text}` }">{{
                page.link.text
              }}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: ["pages"],
  data() {
    return {
      isDropDownActive: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.isDropDownActive = !this.isDropDownActive;
    },
  },
};
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--clr-inkwell);
  height: 4.5rem;
  position: static;
  top: 0;
  left: 0;
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
  margin-top: 0.3rem;
  max-height: 100%;
  width: 9.06rem;
}

.fas {
  font-size: 2rem;
  color: var(--clr-living-coral);
  margin-right: 1rem;
}

.drop__down {
  position: relative;
  display: inline-block;
}

.drop__btn {
  background-color: transparent;
  font-size: 2rem;
  border: none;
  cursor: pointer;
  display: none;
}

.dropdown__content {
  display: none;
  position: absolute;
  z-index: 1;
  background-color: var(--clr-living-coral);
  border-radius: 10%;
}

.dropdown__content ul {
  list-style-type: none;
  padding: 0;
}

.dropdown__content a {
  color: white;
  padding: 0.75rem 1rem;
  text-decoration: none;
  display: block;
}
.dropdown__content.active {
  display: block;
  position: absolute;
  right: 0;
}

@media only screen and (max-width: 600px) {
  .drop__btn {
    display: block;
  }

  .nav__right_side .nav__list {
    display: none;
  }
}
</style>

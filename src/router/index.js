import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Resources from "../views/Resources.vue";
import Users from "../views/Users.vue";

const routes = [
  { path: "/", redirect: '/home' },
  { path: "/home", name: "Home", component: Home },
  { path: "/users", name: "Users", component: Users },
  { path: "/resources", name: "Resources", component: Resources },
  { path: "/products", name: "Products", component: Resources },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "active",
});

export default router;

import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Resources from "../views/Resources.vue";
import Users from "../views/Users.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/home", component: Home },
  { path: "/users", component: Users },
  { path: "/resources", component: Resources },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

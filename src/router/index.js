import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Resources from "../views/Resources.vue";
import Users from "../views/Users.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/home", name: "Home", component: Home },
  { path: "/users", name: "Users", component: Users },
  { path: "/resources", name: "Resources", component: Resources },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

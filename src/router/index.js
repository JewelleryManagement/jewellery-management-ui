import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Resources from "../views/Resources.vue";
import Products from "../views/Products.vue";
import Users from "../views/Users.vue";
import ResourceAvailability from "../components/UserList/ResourceAvailability.vue";

const routes = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { title: "Home page" },
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
    meta: { title: "Users page" },
  },
  {
    path: "/resources",
    name: "Resources",
    component: Resources,
    meta: { title: "Resources page" },
  },
  {
    path: "/products",
    name: "Products",
    component: Products,
    meta: { title: "Products page" },
  },
  {
    path: '/resource-availability/:userId',
    name: 'ResourceAvailability',
    component: ResourceAvailability,
    meta: {title: "Resource availability"},
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "active",
});

router.beforeEach((to,from,next) => {
  const pageTitle = to.meta.title;
  document.title = pageTitle
  next()
})

export default router;

import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Resources from "../views/Resources.vue";
import Products from "../views/Products.vue";
import Users from "../views/Users.vue";
import ResourceDetails from "../views/ResourceDetails.vue";


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
    path: "/resources/add",
    name: "Add Resources",
    component: ResourceDetails,
    meta: { title: "Add resource" },
  },
  {
    path: "/resources/edit/:id",
    name: "Edit-Resource",
    props: true,
    component: ResourceDetails,
    meta: { title: "Edit resource" },
  },

  {
    path: "/products",
    name: "Products",
    component: Products,
    meta: { title: "Products page" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "active",
});

router.beforeEach((to, from, next) => {
  const pageTitle = to.meta.title;
  document.title = pageTitle;
  next();
});

export default router;

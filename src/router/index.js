import { createRouter, createWebHistory } from "vue-router";
// import { useStore } from "vuex";
const Home = () => import("../views/Home.vue");
const Resources = () => import("../views/Resources.vue");
const Products = () => import("../views/Products.vue");
const Users = () => import("../views/Users.vue");
const ResourceDetails = () => import("../views/ResourceDetails.vue");
const UserDetails = () => import("../views/UserDetails.vue");
const UserResourceDetails = () => import("../views/UserResourceDetails.vue");
const Login = () => import("../views/Login.vue");
// const store = useStore();
import store from "@/store/store";
const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "Login page", requiresunAuth: true },
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { title: "Home page", requiresunAuth: true },
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
    meta: { title: "Users page", requiresAuth: true },
  },
  {
    path: "/users/:id",
    props: true,
    name: "Users Details",
    component: UserDetails,
    meta: { title: "Users Details", requiresAuth: true },
  },
  {
    path: "/resources/availability/add/:id",
    props: true,
    name: "Add-Quantity",
    component: UserResourceDetails,
    meta: { title: "Add Quantity", requiresAuth: true },
  },
  {
    path: "/resources/availability/remove/:id",
    props: true,
    name: "Remove-Quantity",
    component: UserResourceDetails,
    meta: { title: "Remove Quantity", requiresAuth: true },
  },
  {
    path: "/resources",
    name: "Resources",
    component: Resources,
    meta: { title: "Resources page", requiresAuth: true },
  },
  {
    path: "/resources/add",
    name: "Add Resources",
    component: ResourceDetails,
    meta: { title: "Add resource", requiresAuth: true },
  },
  {
    path: "/resources/edit/:id",
    name: "Edit-Resource",
    props: true,
    component: ResourceDetails,
    meta: { title: "Edit resource", requiresAuth: true },
  },

  {
    path: "/products",
    name: "Products",
    component: Products,
    meta: { title: "Products page", requiresAuth: true },
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
  if (to.meta.requiresAuth && store.getters["auth/isAuthenticated"]) {
    next();
  } else if (to.meta.requiresunAuth) {
    next();
  } else {
    next("/login");
  }
});

export default router;

import { createRouter, createWebHistory } from "vue-router";
const Home = () => import("../views/Home.vue");
const Resources = () => import("../views/Resources.vue");
const Products = () => import("../views/Products.vue");
const Users = () => import("../views/Users.vue");
const ResourceDetails = () => import("../views/ResourceDetails.vue");
const UserDetails = () => import("../views/UserDetails.vue");
const UserResourceDetails = () => import("../views/UserResourceDetails.vue");

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
    path: "/users/:id",
    props: true,
    name: "Users Details",
    component: UserDetails,
    meta: { title: "Users Details" },
    // children: [
    //   { path: "add", component: ResourceDetails },
    // ]
  },
  {
    path: "/users/:id/add",
    props: true,
    name: "Users resource add",
    component: UserResourceDetails,
    meta: { title: "Users resource add" },
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

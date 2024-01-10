import { createRouter, createWebHistory } from "vue-router";
import store from "@/store/store";

const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: { title: "Login page", requiresunAuth: true },
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/Home.vue"),
    meta: { title: "Home page", requiresAuth: true },
  },
  {
    path: "/users",
    name: "Users",
    component: () => import("../views/Users/Users.vue"),
    meta: { title: "Users page", requiresAuth: true },
  },
  {
    path: "/users/:id",
    props: true,
    name: "Users Details",
    component: () => import("../views/Users/UserDetails.vue"),
    meta: { title: "Users Details", requiresAuth: true },
  },
  {
    path: "/users/create",
    props: true,
    name: "Users Create",
    component: () => import("../views/Users/UserCreate.vue"),
    meta: { title: "Users Create", requiresAuth: true },
  },
  {
    path: "/users/edit/:id",
    props: true,
    name: "Edit-User",
    component: () => import("../views/Users/UserUpdate.vue"),
    meta: { title: "Edit user", requiresAuth: true },
  },
  {
    path: "/resources/availability/add/:resourceId",
    props: true,
    name: "Add-Quantity",
    component: () => import("../views/Users/UserResourceAdd.vue"),
    meta: { title: "Add Quantity", requiresAuth: true },
  },
  {
    path: "/resources/availability/remove/:resourceId/:userId",
    props: true,
    name: "Remove-Quantity",
    component: () => import("../views/Users/UserResourceRemove.vue"),
    meta: { title: "Remove Quantity", requiresAuth: true },
  },
  {
    path: "/resources/availability/transfer/:resourceId/:userId",
    props: true,
    name: "Transfer-Quantity",
    component: () => import("../views/Users/UserResourceTransfer.vue"),
    meta: { title: "Transfer Quantity", requiresAuth: true },
  },
  {
    path: "/resources",
    name: "Resources",
    component: () => import("../views/Resources/Resources.vue"),
    meta: { title: "Resources page", requiresAuth: true },
  },
  {
    path: "/resources/add",
    name: "Add Resources",
    component: () => import("../views/Resources/ResourceDetails.vue"),
    meta: { title: "Add resource", requiresAuth: true },
  },
  {
    path: "/resources/edit/:id",
    name: "Edit-Resource",
    props: true,
    component: () => import("../views/Resources/ResourceDetails.vue"),
    meta: { title: "Edit resource", requiresAuth: true },
  },
  {
    path: "/products",
    name: "Products",
    component: () => import("../views/Products/Products.vue"),
    meta: { title: "Products page", requiresAuth: true },
  },
  {
    path: "/products/add",
    name: "Add Product",
    props: true,
    component: () => import("../views/Products/ProductDetailsCreate.vue"),
    meta: { title: "Add product", requiresAuth: true },
  },
  {
    path: "/products/:productId",
    name: "Product Details",
    props: true,
    component: () => import("../views/Products/ProductsDetailsById.vue"),
    meta: { title: "Product details", requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    meta: { title: "Profile page", requiresAuth: true },
  },
  {
    path: "/sales",
    name: "Sales",
    component: () => import("../views/Sales/Sales.vue"),
    meta: { title: "Sales page", requiresAuth: true },
  },
  {
    path: "/sales/add",
    name: "New Sale",
    component: () => import("../views/Sales/SalesAdd.vue"),
    meta: { title: "New Sale", requiresAuth: true },
  },
  {
    path: "/sales/:saleId",
    name: "Sale-Details",
    component: () => import("../views/Sales/SaleDetails.vue"),
    meta: { title: "Sale Details", requiresAuth: true },
  },
  { path: "/logout", redirect: "/login" },
  {
    path: "/:notFound(.*)",
    component: () => import("../views/NotFound.vue"),
    meta: { requiresunAuth: true },
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
  const isAuthenticated = store.getters["auth/isAuthenticated"];

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.path === "/login" && isAuthenticated) {
    next("/home");
  } else {
    next();
  }
});

export default router;

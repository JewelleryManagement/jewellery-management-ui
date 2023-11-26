import { createRouter, createWebHistory } from "vue-router";
import store from "@/store/store";

const Home = () => import("../views/Home.vue");
const Resources = () => import("../views/Resources.vue");
const Products = () => import("../views/Products.vue");
const ProductsDetails = () => import("../views/ProductsDetails.vue");
const ProductsDetailsById = () => import("../views/ProductsDetailsById.vue");
const Users = () => import("../views/Users.vue");
const ResourceDetails = () => import("../views/ResourceDetails.vue");
const UserDetails = () => import("../views/UserDetails.vue");
const UserResourceAdd = () => import("../views/UserResourceAdd.vue");
const UserResourceRemove = () => import("../views/UserResourceRemove.vue");
const UserResourceTransfer = () => import("../views/UserResourceTransfer.vue");
const Login = () => import("../views/Login.vue");
const Profile = () => import("../views/Profile.vue");
const Sales = () => import("../views/Sales.vue");
const SalesAdd = () => import("../views/SalesAdd.vue");
const SalesDetails = () => import("../views/SalesDetails.vue");
const NotFound = () => import("../views/NotFound.vue");

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
    meta: { title: "Home page", requiresAuth: true },
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
    path: "/resources/availability/add/:resourceId",
    props: true,
    name: "Add-Quantity",
    component: UserResourceAdd,
    meta: { title: "Add Quantity", requiresAuth: true },
  },
  {
    path: "/resources/availability/remove/:resourceId/:userId",
    props: true,
    name: "Remove-Quantity",
    component: UserResourceRemove,
    meta: { title: "Remove Quantity", requiresAuth: true },
  },
  {
    path: "/resources/availability/transfer/:resourceId/:userId",
    props: true,
    name: "Transfer-Quantity",
    component: UserResourceTransfer,
    meta: { title: "Transfer Quantity", requiresAuth: true },
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
  {
    path: "/products/add",
    name: "Add Product",
    props: true,
    component: ProductsDetails,
    meta: { title: "Add product", requiresAuth: true },
  },
  {
    path: "/products/:productId",
    name: "Product Details",
    props: true,
    component: ProductsDetailsById,
    meta: { title: "Product details", requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { title: "Profile page", requiresAuth: true },
  },
  {
    path: "/sales",
    name: "Sales",
    component: Sales,
    meta: { title: "Sales page", requiresAuth: true },
  },
  {
    path: "/sales/add",
    name: "New Sale",
    component: SalesAdd,
    meta: { title: "New Sale", requiresAuth: true },
  },
  {
    path: "/sales/:saleId",
    name: "Sales-Details",
    component: SalesDetails,
    meta: { title: "Sale Details", requiresAuth: true },
  },
  { path: "/logout", redirect: "/login" },
  {
    path: "/:notFound(.*)",
    component: NotFound,
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

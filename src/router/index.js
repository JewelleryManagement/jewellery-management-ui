import { createRouter, createWebHistory } from "vue-router";
import store from "@/store/store";

export const makeFetchGuard =
  ({ dispatch, type, getPayload = (to) => to.params.id }) =>
  async (to) => {
    try {
      await dispatch(getPayload(to));
      return true;
    } catch (e) {
      const status = e?.response?.status;

      if (status === 404 || status === 410) {
        return {
          name: "NotFound",
          query: { type },
          replace: true,
        };
      }

      throw e;
    }
  };

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
    beforeEnter: makeFetchGuard({
      type: "User",
      dispatch: (id) => store.dispatch("users/fetchUser", id),
    }),
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
    beforeEnter: makeFetchGuard({
      type: "User",
      dispatch: (id) => store.dispatch("users/fetchUser", id),
    }),
  },
  {
    path: "/resources",
    name: "Resources",
    component: () => import("../views/Resources/Resources.vue"),
    meta: { title: "Resources page", requiresAuth: true },
  },
  {
    path: "/resources/:id",
    name: "ResourceDetails",
    component: () => import("../views/Resources/ResourcesDetailsById.vue"),
    meta: { title: "Resource page", requiresAuth: true },
    beforeEnter: makeFetchGuard({
      type: "Resource",
      dispatch: (id) =>
        store.dispatch("resources/fetchAvailabilityResourceById", id),
    }),
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
    beforeEnter: makeFetchGuard({
      type: "Resource",
      dispatch: (id) =>
        store.dispatch("resources/fetchAvailabilityResourceById", id),
    }),
  },
  {
    path: "/resources/duplicate/:id",
    name: "Duplicate-Resource",
    props: true,
    component: () => import("../views/Resources/ResourceDetails.vue"),
    meta: { title: "Duplicate resource", requiresAuth: true },
    beforeEnter: makeFetchGuard({
      type: "Resource",
      dispatch: (id) =>
        store.dispatch("resources/fetchAvailabilityResourceById", id),
    }),
  },
  {
    path: "/products",
    name: "Products",
    component: () => import("../views/Products/Products.vue"),
    meta: { title: "Products page", requiresAuth: true },
  },
  {
    path: "/products/add",
    name: "Create Product",
    props: true,
    component: () => import("../views/Products/ProductCreate.vue"),
    meta: { title: "Create product", requiresAuth: true },
  },
  {
    path: "/products/edit/:id",
    name: "Edit Product",
    props: true,
    component: () => import("../views/Products/ProductEdit.vue"),
    meta: { title: "Edit product", requiresAuth: true },
    beforeEnter: makeFetchGuard({
      type: "Product",
      dispatch: (id) => store.dispatch("products/fetchProduct", id),
    }),
  },
  {
    path: "/products/:id",
    name: "Product Details",
    props: true,
    component: () => import("../views/Products/ProductsDetailsById.vue"),
    meta: { title: "Product details", requiresAuth: true },
    beforeEnter: makeFetchGuard({
      type: "Product",
      dispatch: (id) => store.dispatch("products/fetchProduct", id),
    }),
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
    path: "/sales/:id",
    name: "Sale-Details",
    component: () => import("../views/Sales/SaleDetails.vue"),
    meta: { title: "Sale Details", requiresAuth: true },
    beforeEnter: makeFetchGuard({
      type: "Sale",
      dispatch: (id) => store.dispatch("sales/fetchSale", id),
    }),
  },
  { path: "/logout", redirect: "/login" },
  {
    path: "/organizations",
    meta: { title: "Organizations Page", requiresAuth: true },
    component: () => import("../views/Organizations/Organizations.vue"),
  },
  {
    path: "/organizations/:id",
    name: "Organization Details",
    props: true,
    component: () => import("../views/Organizations/OrganizationById"),
    meta: { title: "Organization details", requiresAuth: true },
    beforeEnter: makeFetchGuard({
      type: "Organization",
      dispatch: (id) => store.dispatch("organizations/fetchOrganization", id),
    }),
  },
  {
    path: "/organizations/add",
    meta: { title: "Create organization", requiresAuth: true },
    component: () => import("../views/Organizations/OrganizationsAdd.vue"),
  },
  {
    path: "/organizations/availability/add/:id",
    props: true,
    name: "Add-Quantity",
    component: () =>
      import("../views/Organizations/OrganizationResourceAdd.vue"),
    meta: { title: "Add Quantity", requiresAuth: true },
    beforeEnter: makeFetchGuard({
      type: "Resource",
      dispatch: (id) =>
        store.dispatch("resources/fetchAvailabilityResourceById", id),
    }),
  },
  {
    path: "/organizations/availability/remove/:organizationId/:resourceId/:quantity",
    props: true,
    name: "Remove-Quantity",
    component: () =>
      import("../views/Organizations/OrganizationResourceRemove.vue"),
    meta: { title: "Remove Quantity", requiresAuth: true },
    beforeEnter: makeFetchGuard({
      type: "Resource",
      getPayload: (to) => to.params.resourceId,
      dispatch: (resourceId) =>
        store.dispatch("resources/fetchAvailabilityResourceById", resourceId),
    }),
  },
  {
    path: "/organizations/availability/transfer/:organizationId/:resourceId/:quantity",
    props: true,
    name: "Transfer-Quantity",
    component: () =>
      import("../views/Organizations/OrganizationResourceTransfer.vue"),
    meta: { title: "Transfer Quantity", requiresAuth: true },
    beforeEnter: makeFetchGuard({
      type: "Resource",
      getPayload: (to) => to.params.resourceId,
      dispatch: (resourceId) =>
        store.dispatch("resources/fetchAvailabilityResourceById", resourceId),
    }),
  },
  {
    path: "/organizations/:organizationId/add-user",
    name: "Add-user-to-Organization",
    props: true,
    component: () => import("../views/Organizations/OrganizationUserAdd.vue"),
    meta: { title: "Add user to Organization", requiresAuth: true },
  },
  {
    path: "/organizations/:organizationId/edit-user/:userId",
    name: "Edit-user-in-Organization",
    props: true,
    component: () => import("../views/Organizations/OrganizationUserEdit.vue"),
    meta: { title: "Edit user in Organization", requiresAuth: true },
    beforeEnter: makeFetchGuard({
      type: "User",
      getPayload: (to) => ({
        organizationId: to.params.organizationId,
        userId: to.params.userId,
      }),
      dispatch: (payload) =>
        store.dispatch("users/fetchUserInOrganization", payload),
    }),
  },
  {
    path: "/system-events/:eventId",
    name: "Event-Details",
    component: () => import("../views/Events/EventDetails.vue"),
    meta: { title: "Event Page", requiresAuth: true },
  },
  {
    path: "/not-found",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
    meta: { title: "Not Found", requiresunAuth: true },
  },
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

router.beforeEach((to, from) => {
  document.title = to.meta.title || "App";

  const isAuthenticated = store.getters["auth/isAuthenticated"];

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { path: "/login", replace: true };
  }

  if (to.path === "/login" && isAuthenticated) {
    return { path: "/home", replace: true };
  }

  return true;
});

export default router;

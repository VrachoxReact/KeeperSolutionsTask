import { createRouter, createWebHistory } from "vue-router";
import RoleList from "@/views/RoleList.vue";
import CreateEditRole from "@/views/CreateEditRole.vue";
// Remove the import for NotFound.vue
// import NotFound from "@/views/NotFound.vue";

const routes = [
  {
    path: "/",
    redirect: "/roles",
  },
  {
    path: "/roles",
    name: "RoleList",
    component: RoleList,
  },
  {
    path: "/roles/create",
    name: "CreateRole",
    component: CreateEditRole,
  },
  {
    path: "/roles/:id/edit",
    name: "EditRole",
    component: CreateEditRole,
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"), // Use dynamic import
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard for the edit route
router.beforeEach((to, from, next) => {
  if (to.name === "EditRole" && !to.params.id) {
    next({ name: "RoleList" });
  } else {
    next();
  }
});

export default router;

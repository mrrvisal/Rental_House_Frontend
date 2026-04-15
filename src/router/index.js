import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../pages/Dashboard.vue";
import RoomList from "../pages/RoomList.vue";
import RoomDetail from "../pages/RoomDetail.vue";
import TenantList from "../pages/TenantList.vue";
import AddRecord from "../pages/AddRecord.vue";
import Login from "../pages/Login.vue";

const routes = [
  { path: "/login", component: Login },
  { path: "/", meta: { requiresAuth: true }, component: Dashboard },
  { path: "/rooms", meta: { requiresAuth: true }, component: RoomList },
  { path: "/rooms/:id", meta: { requiresAuth: true }, component: RoomDetail },
  { path: "/tenants", meta: { requiresAuth: true }, component: TenantList },
  {
    path: "/rooms/:id/add-record",
    meta: { requiresAuth: true },
    component: AddRecord,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   if (to.matched.some((record) => record.meta.requiresAuth)) {
//     if (!localStorage.getItem("authToken")) {
//       next("/login");
//     } else {
//       next('/');
//     }
//   } else {
//     next();
//   }
// });

export default router;

import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../pages/Dashboard.vue";
import RoomList from "../pages/RoomList.vue";
import RoomDetail from "../pages/RoomDetail.vue";
import TenantList from "../pages/TenantList.vue";
import AddRecord from "../pages/AddRecord.vue";

const routes = [
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

export default router;

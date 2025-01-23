/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router/auto";
import authRoutes from "./authRoutes";
import collaboratorRoutes from "./collaboratorRoutes";

const routes = [...authRoutes, ...collaboratorRoutes];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

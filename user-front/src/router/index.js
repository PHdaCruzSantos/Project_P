import path from "path";
import { createRouter, createWebHistory } from "vue-router";

const HomeView = () => import("../views/HomeView.vue");
const Cart = () => import("../views/CartView.vue");
const ShippingView = () => import("../views/ShippingView.vue");
const ClientProfileView = () => import("../views/ClientProfileView.vue");

const routes = [
  {
    path: "/",
    name: "HomeView",
    component: HomeView,
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
    meta: { requiresAuth: true },
  },
  {
    path: "/checkout/shipping",
    name: "ShippingView",
    component: ShippingView,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "ClientProfileView",
    component: ClientProfileView,
    meta: { requiresAuth: true },
  },
  // NO AUTH REDIRECT TO HOME
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

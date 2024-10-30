import { createRouter, createWebHistory } from "vue-router";

const Home = () => import("../views/HomeView.vue");
const Cart = () => import("../views/CartView.vue");

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

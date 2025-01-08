import { createRouter, createWebHistory } from "vue-router";

const HomeView = () => import("../views/HomeView.vue");
const Cart = () => import("../views/CartView.vue");
const ShippingView = () => import("../views/ShippingView.vue");
const ClientProfileView = () => import("../views/ClientProfileView.vue");
const PaymentView = () => import("../views/PaymentView.vue");
const OrderConfirmationView = () => import("../views/OrderConfirmation.vue");
const NewOrderView = () => import("../views/NewOrderView.vue");

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
    path: "/profile/:tab?",
    name: "ClientProfileView",
    component: ClientProfileView,
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: "/checkout/payment",
    name: "PaymentView",
    component: PaymentView,
    meta: { requiresAuth: true },
  },
  {
    path: "/order-confirmation",
    name: "OrderConfirmation",
    component: OrderConfirmationView,
    meta: { requiresAuth: true },
  },
  {
    path: "/new-order",
    name: "NewOrderView",
    component: NewOrderView,
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

import { createRouter, createWebHistory } from "vue-router";

const Home = () => import("../views/HomeView.vue");
const About = () => import("../views/AboutView.vue");
const EditItem = () => import("../views/EditItemView.vue");

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/items/edit/:id",
    name: "EditItem",
    component: EditItem,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

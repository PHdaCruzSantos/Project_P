import path from "path";
import { createRouter, createWebHistory } from "vue-router";

const Home = () => import("../views/HomeView.vue");
const Products = () => import("../views/ProductsView.vue");
const EditItem = () => import("../views/EditItemView.vue");
const StoresList = () => import("../views/StoresView.vue");
const AddItemView = () => import("../views/AddItemView.vue");
const EditItemView = () => import("../views/EditItemView.vue");
const ItemInfoView = () => import("../views/ItemInfoView.vue");
const AddSotreView = () => import("../views/AddStoreView.vue");
const EditStoreView = () => import("../views/EditStoreView.vue");

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/products",
    name: "products",
    component: Products,
  },
  {
    path: "/items/edit/:id",
    name: "EditItem",
    component: EditItem,
  },
  {
    path: "/stores",
    name: "StoresList",
    component: StoresList,
  },
  {
    path: "/add-item/:storeId",
    name: "AddItemView",
    component: AddItemView,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-item/:itemId",
    name: "EditItemView",
    component: EditItemView,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/item-info/:itemId",
    name: "ItemInfoView",
    component: ItemInfoView,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/add-store",
    name: "AddStoreView",
    component: AddSotreView,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-store/:storeId",
    name: "EditStoreView",
    component: EditStoreView,
    props: true,
    meta: { requiresAuth: true },
  },
  // redirect to home if no route is matched
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!userStore.isLoggedIn) {
      next({ path: "/login", query: { redirect: to.fullPath } });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;

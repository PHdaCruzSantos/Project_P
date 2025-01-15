import { createRouter, createWebHistory } from "vue-router";

const Home = () => import("../views/HomeView.vue");
const Products = () => import("../views/ProductsView.vue");
const StoreListView = () => import("../views/StoresView.vue");
const EditItem = () => import("../views/EditItemView.vue");
const AddItemView = () => import("../views/AddItemView.vue");
const EditItemView = () => import("../views/EditItemView.vue");
const ItemInfoView = () => import("../views/ItemInfoView.vue");
const AddSotreView = () => import("../views/AddStoreView.vue");
const EditStoreView = () => import("../views/EditStoreView.vue");
const PromoView = () => import("../views/PromoView.vue");

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
    name: "StoreListView",
    component: StoreListView,
  },
  {
    path: "/add-item/:storeId",
    name: "AddItemView",
    component: AddItemView,
    props: true,
  },
  {
    path: "/edit-item/:itemId",
    name: "EditItemView",
    component: EditItemView,
    props: true,
  },
  {
    path: "/item-info/:itemId",
    name: "ItemInfoView",
    component: ItemInfoView,
    props: true,
  },
  {
    path: "/add-store",
    name: "AddStoreView",
    component: AddSotreView,
    props: true,
  },
  {
    path: "/edit-store/:storeId",
    name: "EditStoreView",
    component: EditStoreView,
    props: true,
  },
  {
    path: "/promos",
    name: "PromoView",
    component: PromoView,
    props: true,
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

export default router;

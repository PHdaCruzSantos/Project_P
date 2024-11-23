<template>
  <VMain
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      flex-direction: column;
    "
  >
    <h1>Products</h1>
    <ProductsList />
  </VMain>
</template>

<script>
import { VMain } from "vuetify/components";
import ProductsList from "@/components/ProductsList/ProductsList.vue";
export default {
  name: "AboutView",
  components: {
    VMain,
    ProductsList,
  },
};
</script>

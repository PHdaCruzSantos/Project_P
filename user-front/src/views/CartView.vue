<template>
  <VMain>
    <CartList />
  </VMain>
</template>

<script>
import { VMain } from "vuetify/components";
import CartList from "../components/CartList/CartList.vue";

export default {
  name: "CartView",
  components: {
    VMain,
    CartList,
  },
};
</script>

<style scoped>
.price {
  font-size: 1.2rem;
  color: #4caf50;
}
</style>

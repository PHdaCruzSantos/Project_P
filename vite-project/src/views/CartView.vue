<template>
  <VMain>
    <CartList />
  </VMain>
</template>

<script>
import { VMain } from "vuetify/components";
import { cartStore } from "../store/cartStore";
import CartList from "../components/CartList/CartList.vue";

export default {
  name: "CartView",
  components: {
    VMain,
    CartList,
  },
  data() {
    return {
      headers: [
        { text: "Product", value: "name" },
        { text: "Price", value: "price" },
        { text: "Description", value: "description" },
        { text: "Image", value: "image" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      item: {
        name: cartStore.cart.name,
        description: cartStore.cart.description,
        price: cartStore.cart.price,
        image: cartStore.cart.image,
      },
    };
  },
  methods: {
    removeFromCart(item) {
      // Logic to remove item from cart
      cartStore.removeFromCart(item);
    },
    checkout() {
      // Logic to handle checkout
      console.log("Checkout");
    },
    handleImageLoadError(event) {
      event.target.src = "https://via.placeholder.com/50";
    },
  },
  computed: {
    cartStore() {
      return cartStore;
    },
    formatedPrice() {
      return this.item.price !== undefined
        ? this.item.price.toFixed(2)
        : "0.00";
    },
  },
};
</script>

<style scoped>
.price {
  font-size: 1.2rem;
  color: #4caf50;
}
</style>
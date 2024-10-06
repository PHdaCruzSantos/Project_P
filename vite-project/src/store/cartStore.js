// src/store/cartStore.js
import { reactive } from "vue";

export const cartStore = reactive({
  cart: [],
  addToCart(item) {
    this.cart.push(item);
  },
  removeFromCart(item) {
    const index = this.cart.indexOf(item);
    if (index > -1) {
      this.cart.splice(index, 1);
    }
  },
  clearCart() {
    this.cart = [];
  },
});

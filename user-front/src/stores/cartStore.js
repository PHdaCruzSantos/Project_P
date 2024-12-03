// src/stores/cartStore.js
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    contCartItems: 0,
    userId: null,
    shipping: null,
  }),

  getters: {
    itemCount: (state) => state.contCartItems,
    total: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },

  actions: {
    initCart(userId) {
      this.userId = userId;
      this.loadCart();
    },

    addToCart(item) {
      const existingItem = this.items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.items.push({
          ...item,
          quantity: 1,
          image_names: item.image_names?.split(",")[0] || "",
        });
      }
      this.contCartItems += 1;
      this.saveCart();
    },

    saveCart() {
      if (!this.userId) return;
      localStorage.setItem(
        `cart_${this.userId}`,
        JSON.stringify({
          items: this.items,
          contCartItems: this.contCartItems,
        })
      );
    },

    loadCart() {
      if (!this.userId) return;
      const saved = localStorage.getItem(`cart_${this.userId}`);
      if (saved) {
        const data = JSON.parse(saved);
        this.items = data.items;
        this.contCartItems = data.contCartItems;
      }
    },
    updateItemQuantity(itemId, quantity) {
      const item = this.items.find((i) => i.id === itemId);
      if (item) {
        const diff = quantity - item.quantity;
        item.quantity = quantity;
        this.contCartItems += diff;
        this.saveCart();
      }
    },

    clearCart() {
      this.items = [];
      this.contCartItems = 0;
      this.saveCart();
    },
  },
});

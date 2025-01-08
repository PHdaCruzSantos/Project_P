// src/stores/cartStore.js
import { defineStore } from "pinia";
import clientsApi from "../utils/api/clientsApi";
import itemsApi from "../utils/api/itemsApi";

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

    async addToCart(item) {
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

      try {
        if (this.userId) {
          await clientsApi.addCartItem(this.userId, item.id);
        }
      } catch (error) {
        console.error("Failed to add item to cart", error);
        await this.loadCart();
      }
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

    async loadCart() {
      if (!this.userId) return;
      const saved = localStorage.getItem(`cart_${this.userId}`);
      if (saved) {
        const data = JSON.parse(saved);
        this.items = data.items;
        this.contCartItems = data.contCartItems;
        return;
      }
      try {
        const dbCart = await clientsApi.getCartByClientId(this.userId);
        if (dbCart && dbCart.items > 0) {
          const cartItems = await Promise.all(
            dbCart.map(async (cartItems) => {
              const itemDetails = await itemsApi.getAllInfoItem(
                cartItems.item_id
              );
              return {
                ...itemDetails.item,
                quantity: cartItems.quantity,
                image_names: itemDetails.item.image_names?.split(",")[0] || "",
              };
            })
          );
          this.items = cartItems;
          this.contCartItems = cartItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          this.saveCart();
        }
      } catch (error) {
        console.error("Failed to load cart", error);
      }
    },
    async updateItemQuantity(itemId, quantity) {
      const item = this.items.find((i) => i.id === itemId);
      if (!item) return;
      const oldQuantity = item.quantity;
      const diff = quantity - oldQuantity;

      // Optimistic local update
      item.quantity = quantity;
      this.contCartItems += diff;
      this.saveCart();

      // Sync with database
      try {
        if (this.userId) {
          if (diff > 0) {
            // Add items
            for (let i = 0; i < diff; i++) {
              await clientsApi.addCartItem(this.userId, itemId);
            }
          } else if (diff < 0) {
            // Remove items
            for (let i = 0; i > diff; i--) {
              await clientsApi.removeCartItem(this.userId, itemId);
            }
          }
        }
      } catch (error) {
        console.error("Failed to sync quantity with database:", error);
        // Revert on failure
        item.quantity = oldQuantity;
        this.contCartItems -= diff;
        this.saveCart();
      }
    },

    async removeItem(itemId) {
      const itemIndex = this.items.findIndex((i) => i.id === itemId);
      if (itemIndex === -1) return;

      const item = this.items[itemIndex];
      const quantity = item.quantity;

      // Optimistic local update
      this.items.splice(itemIndex, 1);
      this.contCartItems -= quantity;
      this.saveCart();

      // Sync with database
      try {
        if (this.userId) {
          await clientsApi.removeCartItem(this.userId, itemId);
        }
      } catch (error) {
        console.error("Failed to remove item from database:", error);
        // Revert on failure
        this.items.splice(itemIndex, 0, item);
        this.contCartItems += quantity;
        this.saveCart();
      }
    },

    async clearCart() {
      const oldItems = [...this.items];
      const oldCount = this.contCartItems;

      // Optimistic local update
      this.items = [];
      this.contCartItems = 0;
      this.saveCart();

      // Sync with database
      try {
        if (this.userId) {
          await Promise.all(
            oldItems.map((item) =>
              clientsApi.removeCartItem(this.userId, item.id)
            )
          );
        }
      } catch (error) {
        console.error("Failed to clear cart in database:", error);
        // Revert on failure
        this.items = oldItems;
        this.contCartItems = oldCount;
        this.saveCart();
      }
    },
  },
});

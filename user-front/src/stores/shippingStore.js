import { defineStore } from "pinia";

export const useShippingStore = defineStore("shipping", {
  state: () => ({
    selectedProducts: [],
    shippingAddress: null,
    shippingRates: {},
  }),

  actions: {
    setSelectedProducts(products) {
      this.selectedProducts = products;
    },
    setShippingAddress(address) {
      this.shippingAddress = address;
    },
    setShippingRates(rates) {
      this.shippingRates = rates;
    },
    clearShippingData() {
      this.selectedProducts = [];
      this.shippingAddress = null;
      this.shippingRates = {};
    },
  },
});

import { defineStore } from "pinia";
export const usePaymentStore = defineStore("payment", {
  state: () => ({
    orderItems: [],
    shippingDetails: null,
    totals: {
      itemsTotal: 0,
      shippingTotal: 0,
      grandTotal: 0,
    },
    pixCode: null,
    paymentStatus: null,
  }),

  actions: {
    setOrderData(data) {
      this.orderItems = data.items;
      this.shippingDetails = data.shipping;
      this.totals = data.totals;
    },
    setPixCode(code) {
      this.pixCode = code;
    },
    setPaymentStatus(status) {
      this.paymentStatus = status;
    },
    clearPayment() {
      this.orderItems = [];
      this.shippingDetails = null;
      this.totals = {
        itemsTotal: 0,
        shippingTotal: 0,
        grandTotal: 0,
      };
      this.pixCode = null;
      this.paymentStatus = null;
    },
  },
});

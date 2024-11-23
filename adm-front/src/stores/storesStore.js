import { defineStore } from "pinia";

export const useStoresStore = defineStore("stores", {
  state: () => ({
    stores: [], // Armazena a lista de lojas
  }),
  actions: {
    setStores(storesData) {
      this.stores = storesData;
      console.log("Stores set", storesData);
    },
    clearStores() {
      this.stores = [];
    },
  },
  getters: {
    hasStores: (state) => state.stores.length > 0,
    storeById: (state) => (storeId) => {
      return state.stores.find((store) => store.id === storeId);
    },
  },
});

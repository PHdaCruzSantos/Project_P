import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null, // Armazena os dados do usuário
  }),
  actions: {
    setUser(userData) {
      this.user = userData;
      console.log("User set", userData);
    },
    clearUser() {
      this.user = null;
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
});

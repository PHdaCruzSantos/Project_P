// clientsStore.js
import { defineStore } from "pinia";
import clientsApi from "@/utils/api/clientsApi";

export const useClientStore = defineStore("client", {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    favorites: [],
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
    isFavorite: (state) => (itemId) => {
      return state.favorites.includes(itemId);
    },
  },

  actions: {
    setUser(user) {
      this.user = user;
      this.isAuthenticated = true;
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(user));
    },

    setToken(token) {
      this.token = token;
      // Store token in localStorage
      localStorage.setItem("token", token);
    },

    async updateFavorites() {
      if (!this.isAuthenticated) return;

      try {
        const favorites = await clientsApi.getFavorites(this.user.id);
        this.favorites = favorites;
      } catch (error) {
        console.error("Failed to get favorites:", error);
      }
    },

    async toggleFavorite(itemId) {
      if (!this.isAuthenticated) return;

      try {
        await clientsApi.toggleFavorite(this.user.id, itemId);
        await this.updateFavorites();
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
      }
    },

    async login(credentials) {
      try {
        const { token, user } = await clientsApi.loginClient(credentials);
        this.setUser(user);
        this.setToken(token);
        return { success: true };
      } catch (error) {
        console.error("Login failed:", error);
        return { success: false, error: error.message };
      }
    },

    async register(userData) {
      try {
        const newUser = await clientsApi.createClient(userData);
        // Auto login after registration
        return await this.login({
          email: userData.email,
          password: userData.password,
        });
      } catch (error) {
        console.error("Registration failed:", error);
        return { success: false, error: error.message };
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    initializeStore() {
      // Restore state from localStorage
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        this.user = JSON.parse(storedUser);
        this.token = storedToken;
        this.isAuthenticated = true;
      }
    },

    async updateProfile(userData) {
      try {
        const updatedUser = await clientsApi.updateClient(
          this.user.id,
          userData
        );
        this.setUser(updatedUser);
        return { success: true };
      } catch (error) {
        console.error("Profile update failed:", error);
        return { success: false, error: error.message };
      }
    },
  },
});

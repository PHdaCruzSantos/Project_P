<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-top-transition"
    width="500"
    border-radius="10"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        class="text-none font-weight-regular"
        prepend-icon="mdi-account"
        text="Login"
        variant="tonal"
        v-bind="activatorProps"
      ></v-btn>
    </template>

    <v-card title="Login" :color="palette.midnightblue[900]">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" class="text-center">
            <v-icon color="primary" size="48">mdi-account-circle</v-icon>
          </v-col>
          <v-divider class="border-opacity-100" color="primary"></v-divider>
        </v-row>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row dense class="mt-5 mb-5">
            <v-col cols="12">
              <v-text-field
                label="Email*"
                required
                :rules="[(v) => !!v || 'Email is required']"
                :color="palette.lightblue[100]"
                v-model="user.email"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="user.password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[(v) => !!v || 'Password is required']"
                :type="show1 ? 'text' : 'password'"
                label="Password*"
                variant="outlined"
                @click:append="show1 = !show1"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>
        <v-btn
          :color="palette.dodgerblue[400]"
          text="Login"
          variant="tonal"
          :disabled="!valid"
          @click="handleLogin"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  VDialog,
  VCard,
  VCardText,
  VCardActions,
  VRow,
  VCol,
  VTextField,
  VDivider,
  VBtn,
  VIcon,
  VForm,
  VSpacer,
} from "vuetify/components";
import palette from "../../../palette";
// import useDataBase from "../../utils/useDataBase";
import { useUserStore } from "../../stores/useStore"; // Importa o Pinia store
import api from "../../utils//index";
export default {
  name: "LoginDialog",
  components: {
    VDialog,
    VCard,
    VCardText,
    VCardActions,
    VRow,
    VCol,
    VTextField,
    VDivider,
    VBtn,
    VIcon,
    VForm,
    VSpacer,
  },
  data() {
    return {
      dialog: false,
      user: {
        email: "",
        password: "",
      },
      palette,
      valid: false,
      show1: false,
    };
  },
  methods: {
    async handleLogin() {
      try {
        // const userData = await useDataBase.loginUser(this.user);
        const userData = await api.auth.loginUser(this.user); // Chama a função de login do backend
        const userStore = useUserStore();
        userStore.setUser(userData); // Armazena os dados do usuário no store
        console.log("User logged in:", userStore);
        this.dialog = false;
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
  },
};
</script>

<style scoped>
/* Estilos específicos para o componente */
</style>

// src/vuetify.js
import { createVuetify } from "vuetify";
import "vuetify/styles"; // Importar estilos
import { aliases, mdi } from "vuetify/iconsets/mdi"; // Icones
import palette from "../palette";
import "@mdi/font/css/materialdesignicons.css"; // Importar os ícones MDI

const lightTheme = {
  dark: false,
  colors: {
    primary: palette.brand.main,
    secondary: palette.brand.gray,
    info: palette.brand.info,
    warning: palette.brand.warning,
    error: palette.brand.danger,
    background: palette.brand.gray,

    ...palette.lightblue,
    ...palette.steelblue,
    ...palette.royalblue,
    ...palette.dodgerblue,
    ...palette.slategray,
    ...palette.cadetblue,
    ...palette.midnightblue,
    ...palette.skyblue,
  },
};

const darkTheme = {
  dark: true,
  colors: {
    primary: palette.brand.main,
    secondary: palette.brand.gray,
    info: palette.brand.info,
    warning: palette.brand.warning,
    error: palette.brand.danger,
    background: palette.brand.gray,

    ...palette.lightblue,
    ...palette.steelblue,
    ...palette.royalblue,
    ...palette.dodgerblue,
    ...palette.slategray,
    ...palette.cadetblue,
    ...palette.midnightblue,
    ...palette.skyblue,
  },
};

// Configurações do Vuetify
const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  themes: {
    default: lightTheme,
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  },
});

export default vuetify;

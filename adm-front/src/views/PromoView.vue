<template>
  <v-main>
    <Promo />
  </v-main>
</template>
<script>
import { VMain } from "vuetify/components";
import Promo from "@/components/Promo/Promo.vue";
export default {
  name: "AboutView",
  components: {
    VMain,
    Promo,
  },
};
</script>

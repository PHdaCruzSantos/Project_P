<template>
  <VMain>
    <ClientProfile />
  </VMain>
</template>

<script>
import ClientProfile from "@/components/ClientProfile/ClientProfile.vue";
import { VMain } from "vuetify/components";

export default {
  name: "ClientProfileView",
  components: {
    ClientProfile,
    VMain,
  },
};
</script>

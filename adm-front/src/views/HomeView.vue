<template>
  <VMain>
    <h1>Home</h1>
    <ItemList v-if="userStore.isLoggedIn" />
  </VMain>
</template>

<script>
import { VMain } from "vuetify/components";
import ItemList from "../components/ItemList/ItemList.vue";
import { useUserStore } from "../stores/useStore";
export default {
  name: "HomeView",
  components: {
    VMain,
    ItemList,
  },
  data() {
    return {
      userStore: useUserStore(),
    };
  },
};
</script>

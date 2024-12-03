<template>
  <VMain
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      flex-direction: column;
    "
  >
    <h1>Home</h1>
    <ItemList />
  </VMain>
</template>

<script>
import { VMain } from "vuetify/components";
import ItemList from "../components/ItemList/ItemList.vue";

export default {
  name: "HomeView",
  components: {
    VMain,
    ItemList,
  },
};
</script>

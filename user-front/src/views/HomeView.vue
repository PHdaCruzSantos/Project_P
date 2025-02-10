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
    <ItemList />
  </VMain>
</template>

<script>
import { VMain, VContainer, VImg } from "vuetify/components";
import ItemList from "../components/ItemList/ItemList.vue";

export default {
  name: "HomeView",
  components: {
    VMain,
    VContainer,
    VImg,
    ItemList,
  },
};
</script>

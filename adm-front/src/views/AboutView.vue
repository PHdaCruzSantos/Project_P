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
    <h1>About</h1>
    <AddItem />
  </VMain>
</template>

<script>
import { VMain } from "vuetify/components";
import AddItem from "../components/AddItem/AddItem.vue";
export default {
  name: "AboutView",
  components: {
    VMain,
    AddItem,
  },
};
</script>
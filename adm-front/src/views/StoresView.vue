<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <stores-list />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import StoresList from "@/components/StoresList/StoresList.vue";

export default {
  name: "StoresView",
  components: {
    StoresList,
  },
};
</script>

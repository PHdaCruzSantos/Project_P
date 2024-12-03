<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col cols="12">
          <ItemInfo :itemId="itemId" />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import ItemInfo from "@/components/ItemInfo/ItemInfo.vue";
import { useRoute } from "vue-router";
import { VMain, VContainer, VRow, VCol } from "vuetify/components";

export default {
  name: "ItemInfoView",
  components: {
    ItemInfo,
    VMain,
    VContainer,
    VRow,
    VCol,
  },
  props: {
    itemId: {
      type: String,
      required: true,
    },
  },
  setup() {
    const route = useRoute();
    const itemId = route.params.itemId;

    return {
      itemId,
    };
  },
};
</script>

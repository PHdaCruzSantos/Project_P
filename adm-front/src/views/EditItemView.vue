<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col cols="12" md="6" offset-md="3">
          <EditItem :itemId="itemId" />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import EditItem from "@/components/EditItem/EditItem.vue";
import { VMain, VContainer, VRow, VCol } from "vuetify/components";
import { useRoute } from "vue-router";

export default {
  name: "EditItemView",
  components: {
    EditItem,
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

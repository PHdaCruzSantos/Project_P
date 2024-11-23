<template>
  <div>
    <v-main>
      <v-container>
        <v-card>
          <v-card-title>
            <span class="title">Add Item</span>
          </v-card-title>
          <AddItem :storeId="storeId" />
        </v-card>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import AddItem from "@/components/AddItem/AddItem.vue";
import {
  VMain,
  VContainer,
  VRow,
  VCol,
  VCard,
  VCardTitle,
} from "vuetify/components";

export default {
  name: "AddItemView",
  components: {
    VMain,
    VContainer,
    VRow,
    VCol,
    VCard,
    VCardTitle,
    AddItem,
  },
  props: {
    storeId: {
      type: String,
      required: true,
    },
  },
};
</script>

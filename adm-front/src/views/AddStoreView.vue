<template>
  <v-row>
    <!-- Total Stores -->
    <v-col cols="12" md="4">
      <v-card outlined class="info-card text-center">
        <AddStore :userId="userId" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import AddStore from "@/components/AddStore/AddStore.vue";

export default {
  name: "AddStoreView",
  components: {
    AddStore,
  },
  props: {
    userId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    return {
      userId: props.userId,
    };
  },
};
</script>

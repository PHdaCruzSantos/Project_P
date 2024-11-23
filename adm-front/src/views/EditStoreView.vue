<template>
  <div>
    <EditStore :storeId="storeId" />
  </div>
</template>

<script>
import EditStore from "@/components/EditStore/EditStore.vue";

export default {
  name: "EditStoreView",
  components: {
    EditStore,
  },
  props: {
    storeId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const storeId = props.storeId;
    return { storeId };
  },
};
</script>

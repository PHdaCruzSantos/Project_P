<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4">Filtro</h1>
        <v-select
          v-model="selectedType"
          :items="['All', 'A', 'B']"
          label="Tipo"
          outlined
          dense
          clearable
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4" v-for="item in paginatedItems" :key="item.id">
        <ItemCard :item="item" @add-to-cart="handleAddToCart" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          @input="handlePageChange"
          rounded="circle"
          next-icon="mdi-chevron-right"
          prev-icon="mdi-chevron-left"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ItemCard from "../ItemCard/ItemsCard.vue";
import itemsStore from "../../store/itemsStore";
import {
  VPagination,
  VCol,
  VContainer,
  VRow,
  VSelect,
} from "vuetify/components";
import "vuetify/dist/vuetify.min.css";

export default {
  name: "ItemList",
  components: {
    ItemCard,
    VPagination,
    VCol,
    VContainer,
    VRow,
    VSelect,
  },
  data() {
    return {
      items: [],
      currentPage: 1,
      itemsPerPage: 12,
      selectedType: "All",
    };
  },
  computed: {
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredItems.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage);
    },
    filteredItems() {
      if (this.selectedType === "All") {
        return this.items;
      }
      return itemsStore.getItemsByType(this.selectedType);
    },
  },
  watch: {
    "itemsStore.state.items": {
      handler() {
        this.updateItems();
      },
      deep: true,
    },
  },
  methods: {
    updateItems() {
      this.items = itemsStore.getItems().map((item) => ({
        ...item,
        img: item.img ? `/${item.img}` : "https://via.placeholder.com/300x200",
        price: parseFloat(item.price).toFixed(2),
      }));
    },
    handleAddToCart(item) {
      console.log(`${item.name} foi adicionado ao carrinho!`);
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
  },
  mounted() {
    this.updateItems();
  },
};
</script>
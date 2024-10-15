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
import {
  VPagination,
  VCol,
  VContainer,
  VRow,
  VSelect,
  VBtn,
} from "vuetify/components";
import "vuetify/dist/vuetify.min.css";

import useDataBase from "../../utils/useDatabase.js";


export default {
  name: "ItemList",
  data() {
    return {
      items: [],
      currentPage: 1,
    };
  },
  components: {
    ItemCard,
    VPagination,
    VCol,
    VContainer,
    VRow,
    VSelect,
    VBtn,
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
    async updateItems() {
      try {
        const items = await useDataBase.getItems();
        this.items = items.map((item) => ({
          ...item,
          img: item.img ? `${item.img}` : "https://via.placeholder.com/300x200",
          price: parseFloat(item.price).toFixed(2),
        }));
      } catch (error) {
        console.error("Erro ao buscar itens do banco de dados:", error);
      }
    },
    handleAddToCart(item) {
      console.log(`${item.name} foi adicionado ao carrinho!`);
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
  },
  async mounted() {
    await this.updateItems();
    console.log("Itens carregados do banco de dados:", this.items);
  },
};
</script>
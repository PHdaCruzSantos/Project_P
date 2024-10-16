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
import useDataBase from "../../utils/useDatabase.js";
import {
  VPagination,
  VCol,
  VContainer,
  VRow,
  VSelect,
  VBtn,
} from "vuetify/components";
import "vuetify/dist/vuetify.min.css";

export default {
  name: "ItemList",
  data() {
    return {
      items: [], // Remover ref(), pois `data()` já torna a variável reativa
      currentPage: 1,
      selectedType: 'All', // Filtro adicionado
    };
  },
  computed: {
    paginatedItems() {
      // Apenas para lidar com paginação, exemplo básico
      const itemsPerPage = 3;
      const startIndex = (this.currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return this.items.slice(startIndex, endIndex);
    },
    totalPages() {
      const itemsPerPage = 3;
      return Math.ceil(this.items.length / itemsPerPage);
    },
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
  methods: {
    async loadItemsFromDatabase() {
      try {
        const res = await useDataBase.getItems();
        this.items = res.map((item) => {
          return {
            ...item,
            price: parseFloat(item.price).toFixed(2), // Garantir o formato do preço
          };
        });
        console.log("Itens carregados do banco de dados:", this.items);
      } catch (error) {
        console.error("Erro ao carregar itens do banco de dados:", error);
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
    await this.loadItemsFromDatabase();
  },
};
</script>

<style scoped>
.v-card {
  margin-bottom: 20px;
}
</style>

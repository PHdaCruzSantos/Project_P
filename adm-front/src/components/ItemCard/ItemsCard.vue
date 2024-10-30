<template>
  <v-card
    class="d-flex flex-column justify-center align-center"
    max-width="300"
    outlined
    rounded="lg"
    border="primary sm opacity-100"
  >
  <v-btn icon variant="text" class="delete-btn" @click="deleteItem(item.id)">
    <v-icon>mdi-delete</v-icon>
  </v-btn>
  <v-carousel :show-arrows="false" progress="primary" hide-delimiters height="200" cycle>
    <v-carousel-item v-for="(image, index) in imageSrc" :key="index">
      <v-img
        :src="`${URL_BACKEND}/upload/${image}`"
        @load="handleImageLoad"
        @error="handleImageLoadError"
        aspect-ratio="1"
      />
    </v-carousel-item>
  </v-carousel>
    <v-card-title>{{ item.name }}</v-card-title>
    <v-card-subtitle>R$ {{ formattedPrice }}</v-card-subtitle>
    <v-card-text>{{ item.description }}</v-card-text>
    <v-card-actions>
      <v-btn @click="addToCart" color="primary">
        <v-icon left>mdi-cart-plus</v-icon>
        Adicionar ao carrinho
      </v-btn>
    </v-card-actions>
    <v-btn @click="toggleEdit" color="secondary">Editar</v-btn>
    <EditItem v-if="isEditing" :item="item" @closeEdit="toggleEdit" />
  </v-card>
</template>

<script>
import cartStore from "../../store/cartStore";
import EditItem from "../EditItem/EditItem.vue";
// import "module-alias/register";

import {
  VCard,
  VCardTitle,
  VCardSubtitle,
  VCardText,
  VCardActions,
  VBtn,
  VImg,
  VIcon,
  VCarousel,
  VCarouselItem,
} from "vuetify/components";
import useDataBase from '../../utils/useDatabase';

export default {
  name: "ItemsCard",
  data() {
    return {
      isEditing: false,
      URL_BACKEND: import.meta.env.VITE_API_URL_BACKEND
    };
  },
  components: {
    VCard,
    VCardTitle,
    VCardSubtitle,
    VCardText,
    VCardActions,
    VBtn,
    VImg,
    VIcon,
    VCarousel,
    VCarouselItem,
    EditItem
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    addToCart() {
      // Action to add the item to the cart
      cartStore.addToCart(this.item);
      console.log(this.item);
    },
    handleImageLoad(event) {
      // Verifica se o event.target existe antes de acessar suas propriedades
      if (event && event.target) {
        const img = event.target;
        if (img.naturalWidth > 300 || img.naturalHeight > 200) {
          img.style.objectFit = "cover"; // Ajusta a imagem para caber no card
        }
      }
    },
    deleteItem(id) {
      useDataBase.deleteItem(id);
      this.$emit("deleteItem", id);
    },
    handleImageLoadError(event) {
      if (event && event.target) {
        event.target.src = "https://via.placeholder.com/300x200";
      }
    },
    toggleEdit() {
      this.isEditing = !this.isEditing; // Alterna entre mostrar/ocultar editor
    },
  },
  computed: {
    formattedPrice() {
      const price = parseFloat(this.item.price);
      return !isNaN(price) ? price.toFixed(2) : "0.00";
    },
    imageSrc() {
      // split the image names and get the first one
      console.log("IMG", this.item.image_names.split(",")[0]);
      console.log("021", `http://localhost:3000/upload/${this.item.image_names}`)
      let images = this.item.image_names.split(",");
      return images;
    },
  },
};
</script>

<style scoped>
.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>
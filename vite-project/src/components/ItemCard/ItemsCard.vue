<template>
  <v-card
    class="d-flex flex-column justify-center align-center"
    max-width="300"
    outlined
    rounded="lg"
    border="primary sm opacity-100"
  >
    <v-img
      @load="handleImageLoad"
      @error="handleImageLoadError"
      :src="imageSrc"
      :alt="item.name"
      width="200"
      height="200"
      class="item-image bg-transparent"
      background-size="cover"
      background-color="transparent"
    />
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
import EditItem from "../EditItem/EditItem.vue";
import {
  VCard,
  VCardTitle,
  VCardSubtitle,
  VCardText,
  VCardActions,
  VBtn,
  VImg,
  VIcon,
} from "vuetify/components";
import cartStore from "../../store/cartStore";

export default {
  name: "ItemsCard",
  data() {
    return {
      isEditing: false,
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
    EditItem,
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
      console.log(this.item.img);
      return this.item.img || "https://via.placeholder.com/300x200";
    },
  },
};
</script>
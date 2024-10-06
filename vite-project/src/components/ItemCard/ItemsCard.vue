<template>
  <v-card height="450" width="300">
    <v-img
      @load="handleImageLoad"
      @error="handleImageLoadError"
      :src="imageSrc"
      :alt="item.name"
      width="200"
      heigth="200"
      cover
    />
    <v-card-title>{{ item.name }}</v-card-title>
    <v-card-subtitle>R$ {{ formattedPrice }}</v-card-subtitle>
    <v-card-text>{{ item.description }}</v-card-text>
    <v-card-actions>
      <v-btn @click="addToCart" color="primary">Add to Cart</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {
  VCard,
  VCardTitle,
  VCardSubtitle,
  VCardText,
  VCardActions,
  VBtn,
  VImg,
} from "vuetify/components";
import { cartStore } from "../../store/cartStore";

export default {
  name: "ItemsCard",
  components: {
    VCard,
    VCardTitle,
    VCardSubtitle,
    VCardText,
    VCardActions,
    VBtn,
    VImg,
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
      const img = event.target;
      if (img.naturalWidth > 300 || img.naturalHeight > 200) {
        img.style.objectFit = "cover"; // Adjust the image to fit the card
      }
    },
    handleImageLoadError(event) {
      if (event && event.target) {
        event.target.src = "https://via.placeholder.com/300x200";
      }
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

<style scoped>
/* Your styles here */
</style>
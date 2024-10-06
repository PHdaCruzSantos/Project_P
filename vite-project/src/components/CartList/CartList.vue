<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle>Cart</VCardTitle>
          <VCardText>
            <div class="cart-table-container">
              <VDataTable
                :headers="headers"
                :items="cartStore.cart"
                :hide-default-footer="true"
                fixed-header
              >
                <template v-slot:item="{ item }">
                  <tr class="overflow-y-auto" style="cursor: pointer">
                    <td class="p-2">
                      <v-avatar :image="item.img" />
                    </td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.description }}</td>
                    <td class="price">R${{ item.price }}</td>
                    <td>
                      <transition name="fade">
                        <v-icon
                          @click="removeFromCart(item)"
                          :icon="
                            hoveredIndex === item.id
                              ? 'mdi-delete-empty'
                              : 'mdi-delete'
                          "
                          size="x-large"
                          color="error"
                          @mouseover="isHover(item.id)"
                          @mouseleave="isHover(null)"
                        >
                        </v-icon>
                      </transition>
                    </td>
                  </tr>
                </template>
              </VDataTable>
            </div>
          </VCardText>
          <VCardActions>
            <VBtn @click="checkout" color="success">Checkout</VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import {
  VContainer,
  VRow,
  VCol,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VDataTable,
  VBtn,
  VAvatar,
  VIcon,
  VHover,
} from "vuetify/components";
import { cartStore } from "../../store/cartStore";

export default {
  name: "CartList",
  components: {
    VContainer,
    VRow,
    VCol,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VDataTable,
    VBtn,
    VAvatar,
    VIcon,
    VHover,
  },
  data() {
    return {
      headers: [
        { text: "Product", value: "name" },
        { text: "Price", value: "price" },
        { text: "Description", value: "description" },
        { text: "Image", value: "image" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      item: {
        id: cartStore.cart.id,
        name: cartStore.cart.name,
        description: cartStore.cart.description,
        price: cartStore.cart.price,
        image: cartStore.img
          ? `/${item.img}`
          : "https://via.placeholder.com/300x200",
      },
      hoveredIndex: null,
    };
  },
  methods: {
    removeFromCart(item) {
      // Logic to remove item from cart
      cartStore.removeFromCart(item);
      delete this.hoverIcons[item.id];
    },
    checkout() {
      // Logic to handle checkout
      console.log("Checkout");
    },
    handleImageLoadError(event) {
      event.target.src = "https://via.placeholder.com/50x50";
    },
    isHover(itemId) {
      // console.log("Hovered", itemId);
      this.hoveredIndex = itemId;
      // console.log(this.hoveredIndex);
      return this.hoveredIndex;
    },
  },
  computed: {
    cartStore() {
      return cartStore;
    },
    formattedPrice() {
      const price = parseFloat(this.item.price);
      return !isNaN(price) ? price.toFixed(2) : "0.00";
    },
  },
};
</script>

<style scoped>
.cart-table-container {
  max-height: 400px; /* Defina a altura máxima do contêiner */
  overflow-y: auto; /* Adicione rolagem vertical */
}
.price {
  white-space: nowrap;
  color: green;
  font-weight: bold;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
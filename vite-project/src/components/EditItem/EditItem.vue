<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-img :src="imageSrc" class="item-image"></v-img>
      </v-col>

      <!-- Formulário de Edição -->
      <v-col cols="12" md="6">
        <v-form @submit.prevent="saveItem">
          <v-text-field
            v-model="editedItem.name"
            label="Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="editedItem.price"
            label="Price"
            required
          ></v-text-field>
          <v-select
            v-model="editedItem.type"
            :items="types"
            label="Type"
            required
          ></v-select>
          <v-file-input
            v-model="newImage"
            label="Add Image"
            @change="addImage"
          ></v-file-input>
          <v-btn type="submit" color="primary">Save</v-btn>
          <v-btn @click="$emit('closeEdit')" color="secondary">Cancel</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  VContainer,
  VRow,
  VCol,
  VForm,
  VTextField,
  VSelect,
  VFileInput,
  VBtn,
  VImg,
} from "vuetify/components";
import itemsStore from "../../store/itemsStore";
export default {
  name: "EditItem",
  components: {
    VContainer,
    VRow,
    VCol,
    VForm,
    VTextField,
    VSelect,
    VFileInput,
    VBtn,
    VImg,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editedItem: { ...this.item }, // Faz uma cópia do item para edição
      newImage: null,
      types: ["A", "B", "C"], // Tipos disponíveis
    };
  },
  computed: {
    imageSrc() {
      return this.editedItem.img || "https://via.placeholder.com/300x200";
    },
  },
  methods: {
    saveItem() {
      itemsStore.updateItem(this.editedItem); // Atualiza o item na store
      console.log("Item salvo:", this.editedItem);
      this.$emit("closeEdit"); // Fecha o editor após salvar
    },
    addImage() {
      if (this.newImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.editedItem.img = e.target.result; // Atualiza a imagem principal
          this.newImage = null; // Limpa o campo de upload
        };
        reader.readAsDataURL(this.newImage);
      }
    },
  },
};
</script>

<style scoped>
.item-image {
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>

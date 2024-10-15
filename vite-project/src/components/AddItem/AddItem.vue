<template>
  <v-main
    class="d-flex justify-center align-center"
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    "
  >
    <v-card style="width: 400px; padding: 20px">
      <v-card-title> Add Item </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="name"
            :rules="[(v) => !!v || 'Name is required']"
            label="Name"
            outlined
            required
          />
          <v-text-field
            v-model="price"
            :rules="[
              (v) => !!v || 'Price is required',
              (v) =>
                /^\d+(\.\d{1,2})?$/.test(v) || 'Price must be a valid number',
            ]"
            label="Price (R$)"
            outlined
            required
          />
          <v-text-field
            v-model="description"
            :rules="[
              (v) => !!v || 'Description is required',
              (v) =>
                v.length <= 20 || 'Description must be less than 20 characters',
            ]"
            label="Description"
            outlined
            required
          />
          <v-select
            v-model="type"
            :items="['A', 'B']"
            :rules="[(v) => !!v || 'Type is required']"
            label="Type"
            outlined
            required
          />
          <v-file-input
            v-model="img"
            :rules="[(v) => !!v || 'Image is required']"
            label="Image"
            outlined
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="addItem" :disabled="!valid" color="primary"> Add </v-btn>
      </v-card-actions>
    </v-card>
  </v-main>
</template>

<script>
import {
  VMain,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VTextField,
  VFileInput,
  VSelect,
  VBtn,
  VForm,
} from "vuetify/components";
import itemStore from "../../store/itemsStore";

export default {
  name: "AddItem",
  components: {
    VMain,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VTextField,
    VFileInput,
    VSelect,
    VBtn,
    VForm,
  },
  data() {
    return {
      name: "",
      price: "",
      description: "",
      type: "",
      img: null,
      valid: false,
    };
  },
  methods: {
    addItem() {
      if (this.$refs.form.validate()) {
        const newItem = {
          id: Date.now(),
          name: this.name,
          price: parseFloat(this.price), // Certifique-se de que o preço é um número
          description: this.description,
          type: this.type,
          img: this.img ? URL.createObjectURL(this.img) : null,
        };
        console.log("Adding item...", newItem);
        itemStore.addItem(newItem);
        console.log("Item added successfully!", newItem);
        this.$router.push({ name: "Home" });
      }
    },
  },
};
</script>

<style scoped>
/* Seus estilos aqui */
</style>
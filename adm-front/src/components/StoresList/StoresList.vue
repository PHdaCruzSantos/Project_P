<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="showAddStoreDialog = true"
          >Adicionar Loja</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="stores" class="elevation-1">
          <template v-slot:item.actions="{ item }">
            <v-btn color="blue darken-1" @click="editStore(item)">Edit</v-btn>
            <v-btn color="red darken-1" @click="deleteStore(item.id)"
              >Excluir</v-btn
            >
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="showAddStoreDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Adicionar Loja</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="addStoreForm">
            <v-text-field
              v-model="newStore.name"
              label="Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="newStore.address"
              label="Address"
              required
            ></v-text-field>
            <v-text-field
              v-model="newStore.contact"
              label="Contact"
              required
            ></v-text-field>
            <v-text-field
              v-model="newStore.logo"
              label="Logo URL"
              required
            ></v-text-field>
            <v-text-field
              v-model="newStore.banner"
              label="Banner URL"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="showAddStoreDialog = false"
            >Cancelar</v-btn
          >
          <v-btn color="blue darken-1" text @click="handleAddStore"
            >Adicionar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, onMounted } from "vue";
import { useUserStore } from "../../stores/useStore";
import { useStoresStore } from "../../stores/storesStore";
import storesApi from "../../utils/api/stores";
import {
  VContainer,
  VRow,
  VCol,
  VBtn,
  VDataTable,
  VDialog,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VTextField,
  VSpacer,
} from "vuetify/components";

export default {
  name: "StoresList",
  components: {
    VContainer,
    VRow,
    VCol,
    VBtn,
    VDataTable,
    VDialog,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VTextField,
    VSpacer,
  },
  setup() {
    const userStore = useUserStore();
    const storesStore = useStoresStore();
    const stores = ref([]);
    const showAddStoreDialog = ref(false);
    const newStore = ref({
      name: "",
      address: "",
      contact: "",
      logo: "",
      banner: "",
    });

    const headers = [
      { text: "Name", value: "name" },
      { text: "Address", value: "address" },
      { text: "Contact", value: "contact" },
      { text: "Logo", value: "logo" },
      { text: "Banner", value: "banner" },
      { text: "Actions", value: "actions", sortable: false },
    ];

    const fetchStores = async () => {
      try {
        const response = await storesApi.getStores(userStore.user.user.id);
        stores.value = response;
        storesStore.setStores(stores.value);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      }
    };

    const handleAddStore = async () => {
      try {
        await storesApi.addStore(userStore.user.user.id, newStore.value);
        fetchStores();
        showAddStoreDialog.value = false;
      } catch (error) {
        console.error("Failed to add store:", error);
      }
    };

    const editStore = (store) => {
      // Implement edit store functionality
    };

    const deleteStore = async (storeId) => {
      try {
        await storesApi.deleteStore(storeId);
        fetchStores();
      } catch (error) {
        console.error("Failed to delete store:", error);
      }
    };

    onMounted(fetchStores);

    return {
      stores,
      headers,
      showAddStoreDialog,
      newStore,
      handleAddStore,
      editStore,
      deleteStore,
    };
  },
};
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>

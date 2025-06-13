<template>
  <v-main class="d-flex justify-center align-center" style="height: 100%">
    <v-container>
      <v-card class="elevation-3 mx-auto" max-width="800px">
        <!-- Título -->
        <v-card-title class="text-h5 font-weight-bold">
          <v-icon @click="goBack" :style="{ color: palette.lightblue[300] }">
            mdi-arrow-left
          </v-icon>
          Adicionar novo item à:
          <span class="text-primary">{{ storeName }}</span>
        </v-card-title>

        <v-divider></v-divider>
        <v-card-text>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon color="blue" class="mr-2">mdi-file-upload</v-icon>
                Importar produtos via CSV
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-alert v-if="csvError" type="error" dismissible class="mb-4">
                  {{ csvError }}
                </v-alert>

                <div class="mb-4">
                  <p class="text-body-2 mb-2">
                    O arquivo CSV deve conter as seguintes colunas:
                  </p>
                  <code>nome,descricao,preco,tipo,categoria,status</code>
                </div>

                <v-file-input
                  v-model="csvFile"
                  accept=".csv"
                  label="Selecione o arquivo CSV"
                  variant="outlined"
                  dense
                  class="styled-input mb-4"
                  @change="handleCsvUpload"
                  :error-messages="csvError ? [csvError] : []"
                  show-size
                >
                  <template #prepend>
                    <v-icon color="blue">mdi-file-delimited</v-icon>
                  </template>
                </v-file-input>

                <v-btn
                  color="primary"
                  :loading="importing"
                  :disabled="!csvFile"
                  @click="importCsv"
                  class="mb-2"
                >
                  <v-icon left>mdi-cloud-upload</v-icon>
                  Importar Produtos
                </v-btn>

                <!-- Preview table for CSV data -->
                <v-table v-if="csvPreviewData.length > 0" class="mt-4" dense>
                  <thead>
                    <tr>
                      <th scope="col">Nome</th>
                      <th scope="col">Descrição</th>
                      <th scope="col">Preço</th>
                      <th scope="col">Tipo</th>
                      <th scope="col">Categoria</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(row, index) in csvPreviewData.slice(0, 5)"
                      :key="index"
                    >
                      <td>{{ row.name }}</td>
                      <td>{{ row.description }}</td>
                      <td>R$ {{ row.price }}</td>
                      <td>{{ row.type }}</td>
                      <td>{{ row.category }}</td>
                      <td>{{ row.status }}</td>
                    </tr>
                  </tbody>
                </v-table>
                <p v-if="csvPreviewData.length > 5" class="text-caption mt-2">
                  Mostrando 5 de {{ csvPreviewData.length }} produtos
                </p>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <v-divider></v-divider>

        <!-- Formulário -->
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <!-- Nome -->
            <v-text-field
              v-model="name"
              :rules="[(v) => !!v || 'Nome é obrigatório']"
              label="Nome do Item"
              variant="outlined"
              dense
              class="styled-input"
              required
            >
              <template #prepend>
                <v-icon color="blue">mdi-tag</v-icon>
              </template>
            </v-text-field>

            <!-- Descrição -->
            <v-text-field
              v-model="description"
              :rules="[(v) => !!v || 'Descrição é obrigatória']"
              label="Descrição"
              variant="outlined"
              dense
              class="styled-input"
              required
            >
              <template #prepend>
                <v-icon color="blue">mdi-text-box</v-icon>
              </template>
            </v-text-field>

            <v-row>
              <!-- Preço -->
              <v-col cols="6">
                <v-text-field
                  v-model="price"
                  :rules="[
                    (v) => !!v || 'Preço é obrigatório',
                    (v) =>
                      /^\d+(\.\d{1,2})?$/.test(v) ||
                      'Preço deve ser um número válido',
                  ]"
                  label="Preço (R$)"
                  variant="outlined"
                  dense
                  clearable
                  class="styled-input"
                  required
                >
                  <template #prepend>
                    <v-icon color="blue">mdi-currency-usd</v-icon>
                  </template>
                </v-text-field>
              </v-col>
              <!-- Tipo -->
              <v-col cols="6">
                <v-select
                  v-model="type"
                  :items="[
                    { text: 'Comida', value: 'food' },
                    { text: 'Bebida', value: 'drink' },
                    { text: 'Sobremesa', value: 'dessert' },
                  ]"
                  :rules="[(v) => !!v || 'Tipo é obrigatório']"
                  label="Tipo"
                  variant="outlined"
                  dense
                  class="styled-input"
                  required
                >
                  <template #prepend>
                    <v-icon color="blue">mdi-food</v-icon>
                  </template>
                </v-select>
              </v-col>
            </v-row>

            <v-row>
              <!-- Categoria -->
              <v-col cols="6">
                <v-select
                  v-model="category"
                  :items="categories"
                  :rules="[(v) => !!v || 'Categoria é obrigatória']"
                  label="Categoria"
                  variant="outlined"
                  dense
                  class="styled-input"
                  required
                >
                  <template #prepend>
                    <v-icon color="blue">mdi-shape</v-icon>
                  </template>
                </v-select>
              </v-col>

              <!-- Status -->
              <v-col cols="6">
                <v-select
                  v-model="status"
                  :items="statuses"
                  :rules="[(v) => !!v || 'Status é obrigatório']"
                  label="Status"
                  variant="outlined"
                  dense
                  class="styled-input"
                  required
                >
                  <template #prepend>
                    <v-icon color="blue">mdi-check-circle</v-icon>
                  </template>
                </v-select>
              </v-col>
            </v-row>

            <!-- Imagens -->
            <v-file-input
              v-model="images"
              multiple
              accept="image/*"
              :rules="[
                (v) => v?.length > 0 || 'Pelo menos uma imagem é obrigatória',
              ]"
              label="Enviar Imagens"
              variant="outlined"
              dense
              class="styled-input"
              @change="handleImageChange"
              required
            >
              <template #prepend>
                <v-icon color="blue">mdi-image-multiple</v-icon>
              </template>
            </v-file-input>

            <!-- Botões de Ação -->
            <v-card-actions>
              <v-btn color="grey darken-1" text @click="clearForm"
                >Limpar</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!valid"
                color="blue darken-2"
                @click="handleSubmit"
              >
                Salvar
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="5000">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </v-main>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import itemsApi from "../../utils/api/items";
import storesApi from "../../utils/api/stores";
import uploadApi from "@/utils/api/uploads";
import { useRouter } from "vue-router";
import palette from "../../../palette";
import Papa from "papaparse";
import {
  VMain,
  VContainer,
  VCard,
  VCardTitle,
  VCardText,
  VDivider,
  VForm,
  VTextField,
  VSelect,
  VFileInput,
  VRow,
  VCol,
  VImg,
  VCardActions,
  VSpacer,
  VBtn,
  VIcon,
  VChip,
  VExpansionPanels,
  VExpansionPanel,
  VExpansionPanelTitle,
  VExpansionPanelText,
  VAlert,
  VTable,
  VSnackbar,
} from "vuetify/components";

export default {
  name: "AddItem",
  components: {
    VMain,
    VContainer,
    VCard,
    VCardTitle,
    VCardText,
    VDivider,
    VForm,
    VTextField,
    VSelect,
    VFileInput,
    VRow,
    VCol,
    VImg,
    VCardActions,
    VSpacer,
    VBtn,
    VIcon,
    VChip,
    VExpansionPanels,
    VExpansionPanel,
    VExpansionPanelTitle,
    VExpansionPanelText,
    VAlert,
    VTable,
    VSnackbar,
  },
  props: {
    storeId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const valid = ref(false);
    const name = ref("");
    const description = ref("");
    const price = ref("");
    const category = ref("");
    const type = ref([]);
    const images = ref([]); // Array for multiple images
    const status = ref("active");
    const types = ref(["food", "drink", "dessert"]);
    const categories = ref([]);
    const categoriesObj = ref({});
    const statuses = ref(["active", "inactive"]);
    const router = useRouter();

    const storeName = ref("");
    const storeDescription = ref("");
    const storeImage = ref("");
    const storeStatus = ref("");

    const snackbar = ref({
      show: false,
      text: "",
      color: "success",
    });
    const csvFile = ref(null);
    const csvError = ref("");
    const csvPreviewData = ref([]);
    const importing = ref(false);

    // Remove papaParse ref since we're not using the Vue component anymore
    const validateCsvData = (data) => {
      // Primeiro, vamos logar os dados para debug
      console.log("Headers recebidos:", Object.keys(data[0]));

      const requiredColumns = [
        "nome",
        "descricao",
        "preco",
        "tipo",
        "categoria",
        "status",
      ];
      const headers = Object.keys(data[0]).map((header) =>
        header.toLowerCase().trim()
      );

      console.log("Headers processados:", headers);

      // Verifica se todas as colunas necessárias estão presentes
      const missingColumns = requiredColumns.filter(
        (col) => !headers.includes(col)
      );

      if (missingColumns.length > 0) {
        console.log("Colunas encontradas:", headers);
        console.log("Colunas faltando:", missingColumns);
        throw new Error(
          `Colunas obrigatórias faltando: ${missingColumns.join(", ")}`
        );
      }

      return true;
    };

    const handleCsvUpload = (event) => {
      csvPreviewData.value = [];
      csvError.value = "";

      if (!csvFile.value) {
        csvError.value = "Por favor, selecione um arquivo CSV";
        return;
      }

      // Primeiro, vamos tentar ler o arquivo como texto para debug
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log("Conteúdo do arquivo:", e.target.result.substring(0, 200)); // Primeiros 200 caracteres

        Papa.parse(csvFile.value, {
          header: true,
          skipEmptyLines: true,
          encoding: "UTF-8",
          transformHeader: (header) => {
            console.log("Header original:", header);
            // Remove BOM e espaços extras
            header = header.trim().replace(/^\uFEFF/, "");
            console.log("Header processado:", header);
            return header.toLowerCase();
          },
          complete: (results) => {
            console.log("Resultado do parse:", results);
            try {
              if (results.data.length === 0) {
                throw new Error("O arquivo CSV está vazio");
              }

              if (results.errors.length > 0) {
                console.log("Erros do Papa Parse:", results.errors);
                throw new Error(
                  `Erro ao processar o arquivo: ${results.errors[0].message}`
                );
              }

              validateCsvData(results.data);

              // Formata os dados antes de salvar no preview
              csvPreviewData.value = results.data.map((row) => ({
                name: row.nome,
                description: row.descricao,
                price: parseFloat(row.preco.replace(",", ".")),
                type: row.tipo.toLowerCase(),
                category: row.categoria,
                status: row.status.toLowerCase(),
              }));
            } catch (error) {
              csvError.value = error.message;
              csvPreviewData.value = [];
              console.error("Erro completo:", error);
            }
          },
          error: (error) => {
            console.error("Erro do Papa Parse:", error);
            csvError.value = `Erro ao processar o arquivo: ${error.message}`;
            csvPreviewData.value = [];
          },
        });
      };

      reader.onerror = (error) => {
        console.error("Erro ao ler arquivo:", error);
        csvError.value = "Erro ao ler o arquivo";
      };

      reader.readAsText(csvFile.value, "UTF-8");
    };

    const importCsv = async () => {
      if (!csvPreviewData.value.length) {
        csvError.value = "Nenhum dado para importar";
        return;
      }

      importing.value = true;
      const results = {
        success: 0,
        errors: [],
      };

      try {
        for (const item of csvPreviewData.value) {
          try {
            const categoryObj = categoriesObj.value.find(
              (cat) => cat.name.toLowerCase() === item.category.toLowerCase()
            );

            if (!categoryObj) {
              throw new Error(`Categoria '${item.category}' não encontrada`);
            }

            const newItem = {
              name: item.name,
              description: item.description,
              price: item.price,
              category_id: categoryObj.id,
              type: item.type,
              status: item.status,
              image_names: [],
            };

            await itemsApi.addItem(props.storeId, newItem);
            results.success++;
          } catch (error) {
            results.errors.push(`${item.name}: ${error.message}`);
          }
        }

        // Exibe resultado da importação
        snackbar.value = {
          show: true,
          text: `Importação concluída: ${results.success} produtos importados, ${results.errors.length} falhas`,
          color: results.errors.length > 0 ? "warning" : "success",
        };

        if (results.errors.length > 0) {
          console.error("Erros na importação:", results.errors);
        }

        // Limpa dados após importação bem-sucedida
        if (results.success > 0) {
          csvFile.value = null;
          csvPreviewData.value = [];
        }
      } catch (error) {
        snackbar.value = {
          show: true,
          text: `Erro na importação: ${error.message}`,
          color: "error",
        };
      } finally {
        importing.value = false;
      }
    };

    // Watch para o arquivo CSV
    watch(csvFile, (newFile) => {
      if (newFile) {
        handleCsvUpload();
      } else {
        csvPreviewData.value = [];
        csvError.value = "";
      }
    });
    const fetchCategories = async () => {
      try {
        const response = await itemsApi.getAllCategories();
        categoriesObj.value = response;
        categories.value = categoriesObj.value.map((category) => category.name);
        console.log("categories", categories.value);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    const fatchStoreInfos = async () => {
      try {
        const response = await storesApi.getStore(props.storeId);
        console.log("storeInfos", response);
        storeName.value = response.store.name;
        storeDescription.value = response.store.description;
        storeImage.value = response.store.image;
        storeStatus.value = response.store.status;

        console.log("storeInfos", response);
      } catch (error) {
        console.error("Failed to fetch store infos:", error);
      }
    };

    const clearForm = () => {
      name.value = "";
      description.value = "";
      price.value = "";
      types.value = "";
      category.value = "";
      images.value = [];
      status.value = "active";
    };

    const goBack = () => {
      router.go(-1);
    };

    const handleSubmit = async () => {
      if (valid.value) {
        try {
          // First upload images
          const uploadedFiles = await uploadApi.uploadFiles(images.value);

          const item = {
            name: name.value,
            description: description.value,
            price: parseFloat(price.value),
            category_id: categoriesObj.value.find(
              (cat) => cat.name === category.value
            ).id,
            type: types.value,
            image_names: uploadedFiles.files, // Use returned filenames
            status: status.value,
          };

          // Then create item
          await itemsApi.addItem(props.storeId, item);
          clearForm();
          router.back();
        } catch (error) {
          console.error("Failed to add item:", error);
        }
      }
    };

    // Update image handlers
    const handleImageChange = () => {
      if (images.value && images.value.length > 0) {
        imagePreviews.value = [];
        Array.from(images.value).forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            imagePreviews.value.push(e.target.result);
          };
          reader.readAsDataURL(file);
        });
      }
    };

    watch(images, handleImageChange);
    const addImage = (file) => {
      images.value.push(file);
    };

    const imagePreviews = computed(
      () => images.value.map((file) => URL.createObjectURL(file)),
      console.log("images", images.value)
    );

    const removeImage = (index) => {
      images.value.splice(index, 1);
    };

    onMounted(() => {
      fetchCategories();
      fatchStoreInfos();
    });

    return {
      valid,
      name,
      description,
      price,
      type,
      category,
      images,
      status,
      types,
      categories,
      statuses,
      imagePreviews,
      storeName,
      storeDescription,
      storeImage,
      storeStatus,

      palette,
      handleSubmit,
      clearForm,
      removeImage,
      addImage,
      handleImageChange,
      goBack,

      csvFile,
      csvError,
      csvPreviewData,
      importing,
      handleCsvUpload,
      snackbar,
      importCsv,
    };
  },
};
</script>

<style scoped>
.preview-container {
  border: 1px dashed #ddd;
  padding: 10px;
  border-radius: 8px;
  background-color: #fff;
}
.preview-table {
  max-height: 300px;
  overflow-y: auto;
}

.v-chip {
  margin: 5px;
}

.v-main {
  background: #f9f9f9;
}
</style>

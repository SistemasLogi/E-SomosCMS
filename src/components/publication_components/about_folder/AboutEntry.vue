<template>
  <v-container>
    <v-row class="mt-12 ml-2">
      <h2>Editar Pagina Nosotros</h2>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-alert type="info" variant="tonal">
          <p style="color: black">
            Puedes editar el título y la imagen del banner de encabezado.
          </p>
        </v-alert>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-5 mb-5" v-if="loadingData">
      <v-col cols="12">
        <v-skeleton-loader
          class="mx-auto border"
          type="text, image"
        ></v-skeleton-loader>
      </v-col>
    </v-row>
    <v-card class="mt-5 pa-4 position-relative" v-if="!loadingData">
      <!-- Botón de Editar en la esquina superior derecha -->
      <v-btn
        icon="mdi-pencil"
        variant="text"
        color="primary"
        class="edit-btn"
        v-tooltip:top="'Editar cabecera'"
        @click=""
      ></v-btn>

      <!-- Título de la sección -->
      <v-row justify="center" class="ma-5">
        <v-col cols="12" class="text-center">
          <h2 class="text-h4 font-weight-bold">{{ sectionTitle }}</h2>
          <v-img class="mx-auto" :src="imagenBanner"></v-img>
        </v-col>
      </v-row>
    </v-card>
  </v-container>

  <!-- Dialogo de Error -->
  <v-dialog v-model="visibleError" max-width="500px">
    <v-card>
      <v-card-title class="headline">Error</v-card-title>
      <v-divider class="mt-3"></v-divider>
      <v-card-text
        ><v-alert
          :text="textDialog"
          :title="codeError"
          type="error"
          variant="tonal"
        ></v-alert
      ></v-card-text>
      <v-divider class="mt-3"></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="primary" text @click="closeDialog"
          >Cerrar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import axios from "axios";
import { shallowRef, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { graphqlServerUrl, graphqlImagesUrl } from "@/graphql/config";
import {
  checkLocalStorageData,
  getTokenRefreshKeyCollaborator,
} from "@/graphql/utils";
import { PublicationPublicQueries } from "@/graphql/queries/publication_queries";
import { PublicationMutations } from "@/graphql/mutations/publication_mutations";

const density = shallowRef("compact");
const router = useRouter();
const route = useRoute();

const visibleError = ref(false);
const textDialog = ref("");
const codeError = ref("");
const sectionId = ref(null);
const loadingData = ref(false);
const sectionTitle = ref("");
const imagenBanner = ref("");
const rules = ref({
  required: (value) => !!value || "Requerido.",
  min: (v) => v.length >= 8 || "Minimo 8 caracteres",
  numberRule: (value) => /^\d+$/.test(value) || "Solo se permiten números",
  emailRule: (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value) || "Correo electrónico inválido";
  },
  maxLengthRule: (max) => (value) =>
    !value || value.length <= max || `Máximo ${max} caracteres`,
  // Regla para URLs válidas
  urlRule: (value) => {
    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(value) || "URL inválida";
  },
});

const getDataAboutSection = async (id) => {
  loadingData.value = true;
  const initialQuery = PublicationPublicQueries.getSectionList(id);
  try {
    const response = await axios.post(graphqlServerUrl, {
      query: initialQuery,
    });

    const { data } = response;

    if (data && data.data) {
      const { status_code, status_message, sections } = data.data.sectionList;

      if (status_code === 200 && sections.length > 0) {
        sectionTitle.value = sections[0].section_title;
        imagenBanner.value = `${graphqlImagesUrl}/${sections[0].url_header_image}`;

        loadingData.value = false;

        console.log(sections);
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    loadingData.value = false;
  }
};

const handleError = (response) => {
  codeError.value = `Error: ${response.code}`;
  textDialog.value = response.message;
  visibleError.value = true;
};

onMounted(async () => {
  const tokenExists = checkLocalStorageData("TokenCollaboratorCms");

  // Lógica basada en si el token existe o no
  if (tokenExists) {
    sectionId.value = route.params.id;
    console.log("EXISTE ", sectionId.value);
    await getDataAboutSection(sectionId.value);
    //await getDataAboutPage(2);
  } else {
    router.push("/");
  }
});
</script>

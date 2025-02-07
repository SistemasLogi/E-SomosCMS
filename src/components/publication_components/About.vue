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
    <v-row justify="center" class="mt-5 mb-5">
      <v-col cols="12">
        <v-skeleton-loader
          class="mx-auto border"
          type="text, image"
        ></v-skeleton-loader>
      </v-col>
    </v-row>
    <v-card class="mt-5 pa-4 position-relative">
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
          <h2 class="text-h4 font-weight-bold">Nosotros</h2>
          <v-img class="mx-auto" :src="imagenBanner"></v-img>
        </v-col>
      </v-row>
    </v-card>
    <v-divider class="border-opacity-25 mt-3"></v-divider>
    <v-row class="mt-5">
      <v-col cols="12">
        <v-alert type="info" variant="tonal">
          <p style="color: black">
            En esta sección podrás crear o editar secciones y configurar la
            entrada para cada sección.
          </p>
        </v-alert>
      </v-col>
    </v-row>
    <v-card class="mt-5 pa-4">
      <v-row justify="center" class="mt-5 mb-5">
        <v-col cols="12" lg="3">
          <v-skeleton-loader
            class="mx-auto border"
            type="avatar, heading, text"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
      <!-- Tarjetas de enlaces -->
      <v-row justify="center" class="mt-5 mb-5">
        <v-col cols="12" sm="6" lg="3">
          <v-card rounded="lg">
            <v-card-text>
              <v-avatar
                color="primary"
                icon="mdi-calendar-multiselect"
                size="40"
                @click=""
              ></v-avatar>
            </v-card-text>
            <v-card-title><h3>Historia</h3></v-card-title>
            <v-card-text>
              <p>
                Provident nihil minus qui consequatur non omnis maiores. Eos
                accusantium minus dolores iure perferendis tempore et
                consequatur.
              </p>
            </v-card-text>
            <v-card-actions>
              <v-btn
                icon="mdi-pencil"
                variant="text"
                color="primary"
                v-tooltip:top="'Editar sección'"
                @click=""
              ></v-btn>
              <v-btn
                icon="mdi-trash-can"
                color="error"
                variant="text"
                v-tooltip:top="'Eliminar sección'"
                @click=""
              ></v-btn>
              <v-btn
                icon="mdi-file-document-edit"
                color="dark"
                variant="text"
                v-tooltip:top="'Configurar entrada'"
                @click=""
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" lg="3">
          <v-card
            rounded="lg"
            class="add-card d-flex flex-column align-center text-center pa-4"
            @click=""
          >
            <v-btn
              icon="mdi-plus"
              color="primary"
              fab
              class="floating-btn animate-pulse"
            ></v-btn>
            <v-card-title class="responsive-title mt-3"
              >Agregar Nueva Tarjeta</v-card-title
            >
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script setup>
import axios from "axios";
import { shallowRef, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  graphqlServerUrl,
  graphqlImagesUrl,
  imagenBanner,
} from "@/graphql/config";
import {
  checkLocalStorageData,
  getTokenRefreshKeyCollaborator,
} from "@/graphql/utils";
import { PublicationPublicQueries } from "@/graphql/queries/publication_queries";
import { PublicationMutations } from "@/graphql/mutations/publication_mutations";
</script>
<style scoped>
.error-message {
  display: block;
  font-size: 0.875rem;
  color: #e01304;
  margin-top: 4px;
  padding-left: 16px; /* Le da un pequeño margen izquierdo */
}

.add-card {
  border: 2px dashed #1c8c81; /* Borde punteado primary */
  background-color: rgba(139, 166, 41, 0.055); /* Fondo con secondary */
  transition: background-color 0.3s ease, transform 0.2s ease;
  cursor: pointer;
}

.add-card:hover {
  background-color: rgba(139, 166, 41, 0.1); /* Más intenso en hover */
  transform: scale(1.05); /* Efecto de ligera expansión */
}

.floating-btn {
  width: 60px;
  height: 60px;
  color: #261918; /* dark para el ícono */
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.animate-pulse {
  animation: pulse 1.5s infinite;
}

.text-dark {
  color: #261918 !important; /* Texto con dark */
}

.position-relative {
  position: relative;
}

.edit-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}

.responsive-title {
  white-space: normal; /* Permite saltos de línea */
  word-wrap: break-word; /* Rompe palabras largas */
  text-wrap: balance; /* Mejora la distribución del texto */
  max-width: 100%; /* Se adapta al tamaño del contenedor */
  font-size: 1.2rem; /* Ajusta el tamaño del texto */
}
</style>

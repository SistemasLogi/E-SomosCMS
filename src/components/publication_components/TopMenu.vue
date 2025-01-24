<template>
  <v-container>
    <v-row class="mt-12 ml-2">
      <h2>Editar Menú Superior</h2>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-alert type="info" variant="tonal">
          <p style="color: black">
            En esta sección podrás editar el logo ubicado en el menú superior
            para tema claro.
          </p>
        </v-alert>
      </v-col>
    </v-row>
    <v-card class="mt-5">
      <v-row class="ma-2">
        <v-col cols="12"><b>Menú Tema Claro</b></v-col>
        <v-col cols="auto">
          <v-btn
            class="text-none"
            color="primary"
            rounded="lg"
            density="comfortable"
            append-icon="mdi-image-edit"
            @click="visibleDialogLight = true"
            >Editar Logo</v-btn
          >
        </v-col>
        <!-- Menú para pantallas grandes -->
        <v-col cols="12" v-show="!isMobile">
          <v-toolbar :elevation="8" rounded="lg">
            <v-toolbar-title>
              <v-img
                :src="logoCompany"
                :width="150"
                aspect-ratio="16/9"
                cover
              ></v-img>
            </v-toolbar-title>
            <v-spacer></v-spacer>

            <h5 class="pa-2">Inicio</h5>
            <h5 class="pa-2">Nosotros</h5>
            <h5 class="pa-2">Rutas</h5>
            <h5 class="pa-2">Noticias</h5>
            <h5 class="pa-2">Trabaja con Nosotros</h5>
            <h5 class="pa-2">Colaboradores</h5>
          </v-toolbar>
        </v-col>

        <!-- Menú para pantallas pequeñas -->
        <v-col cols="12" v-show="isMobile">
          <v-toolbar :elevation="8" rounded="lg">
            <v-toolbar-title>
              <v-img
                :src="logoCompany"
                :width="150"
                aspect-ratio="16/9"
                cover
              ></v-img>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
          </v-toolbar>
        </v-col>
      </v-row>
    </v-card>

    <v-divider class="border-opacity-25 mt-3"></v-divider>

    <v-row>
      <v-col cols="12" class="mt-5">
        <v-alert type="info" variant="tonal">
          <p style="color: black">
            En esta sección podrás editar el logo ubicado en el menú superior
            para tema oscuro.
          </p>
        </v-alert>
      </v-col>
    </v-row>

    <v-card class="mt-5">
      <v-row class="ma-2 mt-5">
        <v-col cols="12"><b>Menú Tema Oscuro</b></v-col>
        <v-col cols="auto">
          <v-btn
            class="text-none"
            color="primary"
            rounded="lg"
            density="comfortable"
            append-icon="mdi-image-edit"
            @click="visibleDialogDark = true"
            >Editar Logo</v-btn
          >
        </v-col>
        <v-col cols="12" v-show="!isMobile">
          <v-toolbar :elevation="8" rounded="lg" color="#222">
            <v-toolbar-title>
              <v-img
                :src="logoCompany"
                :width="150"
                aspect-ratio="16/9"
                cover
              ></v-img>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <h5 class="pa-2">Inicio</h5>
            <h5 class="pa-2">Nosotros</h5>
            <h5 class="pa-2">Rutas</h5>
            <h5 class="pa-2">Noticias</h5>
            <h5 class="pa-2">Trabaja con Nosotros</h5>
            <h5 class="pa-2">Colaboradores</h5>
          </v-toolbar>
        </v-col>
        <v-col cols="12" v-show="isMobile">
          <v-toolbar :elevation="8" rounded="lg" color="#222">
            <v-toolbar-title>
              <v-img
                :src="logoCompany"
                :width="150"
                aspect-ratio="16/9"
                cover
              ></v-img>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-app-bar-nav-icon></v-app-bar-nav-icon>
          </v-toolbar>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
  <v-dialog v-model="visibleDialogLight" max-width="500">
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h5 text-medium-emphasis ps-2">
          Invite John to connect
        </div>

        <v-btn
          icon="mdi-close"
          variant="text"
          @click="visibleDialogLight = false"
        ></v-btn>
      </v-card-title>

      <v-divider class="mb-4"></v-divider>

      <v-card-text>
        <v-col cols="12">
          <v-file-upload
            title="Arrastra o selecciona un logo"
            :density="density"
          ></v-file-upload>
        </v-col>
      </v-card-text>

      <v-divider class="mt-2"></v-divider>

      <v-card-actions class="my-2 d-flex justify-end">
        <v-btn
          class="text-none"
          rounded="lg"
          text="Cancel"
          @click="visibleDialogLight = false"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="lg"
          text="Send"
          variant="flat"
          @click="visibleDialogLight = false"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="visibleDialogDark" max-width="500">
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h5 text-medium-emphasis ps-2">
          Invite John to connect
        </div>

        <v-btn
          icon="mdi-close"
          variant="text"
          @click="visibleDialogDark = false"
        ></v-btn>
      </v-card-title>

      <v-divider class="mb-4"></v-divider>

      <v-card-text>
        <v-col cols="12">
          <v-file-upload
            color="dark"
            title="Arrastra o selecciona un logo"
            :density="density"
          ></v-file-upload>
        </v-col>
      </v-card-text>

      <v-divider class="mt-2"></v-divider>

      <v-card-actions class="my-2 d-flex justify-end">
        <v-btn
          class="text-none"
          rounded="lg"
          text="Cancel"
          @click="visibleDialogDark = false"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="lg"
          text="Send"
          variant="flat"
          @click="visibleDialogDark = false"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { shallowRef, ref, onMounted, onUnmounted } from "vue";
import { graphqlServerUrl, logoCompany } from "@/graphql/config";

const density = shallowRef("compact");

const isMobile = ref(false);
const visibleDialogLight = ref(false);
const visibleDialogDark = ref(false);

// Función para detectar el tamaño de la pantalla
const updateScreenSize = () => {
  isMobile.value = window.innerWidth < 960; // Cambia según el breakpoint que desees (960px para lg)
};

// Escucha de eventos de cambio de tamaño
onMounted(() => {
  updateScreenSize();
  window.addEventListener("resize", updateScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize);
});
</script>

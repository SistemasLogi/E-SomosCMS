<template>
  <v-container>
    <v-row class="mt-12 ml-2">
      <h2>Editar Enlaces de Interés</h2>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-alert type="info" variant="tonal">
          <p style="color: black">
            Puedes editar el título y el texto descriptivo de la sección.
          </p>
        </v-alert>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-5 mb-5" v-if="loadingData">
      <v-col cols="12">
        <v-skeleton-loader
          class="mx-auto border"
          type="heading, text, text"
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
        v-tooltip:top="'Editar sección'"
        @click="openDialogEditSection"
      ></v-btn>

      <!-- Título de la sección -->
      <v-row justify="center" class="ma-5">
        <v-col cols="12" class="text-center">
          <h2 class="text-h4 font-weight-bold">{{ dataSection.title }}</h2>
          <p class="text-body-1">
            {{ dataSection.description }}
          </p>
        </v-col>
      </v-row>
    </v-card>
    <v-divider class="border-opacity-25 mt-3"></v-divider>
    <v-row class="mt-5">
      <v-col cols="12">
        <v-alert type="info" variant="tonal">
          <p style="color: black">
            En esta sección podrás editar los enlaces de interés, agregar nuevos
            y configurar las redes sociales o enlaces de contacto de cada uno.
          </p>
        </v-alert>
      </v-col>
    </v-row>
    <v-card class="mt-5">
      <v-row justify="center" class="mt-5 mb-5" v-if="loadingData">
        <v-col cols="12" lg="2">
          <v-skeleton-loader
            class="mx-auto border"
            type="image, heading, button"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
      <!-- Tarjetas de enlaces -->
      <v-row justify="center" class="mt-5 mb-5" v-if="!loadingData">
        <v-col
          v-for="(link, index) in links"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="2"
        >
          <v-card
            rounded="lg"
            class="d-flex flex-column align-center text-center pa-4"
          >
            <v-card-actions>
              <v-btn
                icon="mdi-pencil"
                variant="text"
                color="primary"
                v-tooltip:top="'Editar imagen o titulo'"
                @click="openDialogEditTarget"
              ></v-btn>
              <v-btn
                icon="mdi-trash-can"
                color="error"
                variant="text"
                v-tooltip:top="'Eliminar tarjeta'"
                @click=""
              ></v-btn>
            </v-card-actions>
            <v-img
              :src="link.image"
              height="150px"
              cover
              class="circular-image"
            ></v-img>
            <v-card-title>{{ link.name }}</v-card-title>
            <v-card-subtitle class="d-flex justify-center align-center">
              <v-img
                v-for="social in link.socials"
                :key="social.icon"
                :src="social.icon"
                height="30"
                width="30"
                contain
                class="mx-1"
              ></v-img>
            </v-card-subtitle>
            <v-card-actions>
              <v-btn
                class="text-none"
                color="primary"
                rounded="lg"
                text="Editar link's"
                variant="flat"
                @click=""
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4" lg="2">
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
  <!-- Dialogo de Editar Título -->
  <v-dialog v-model="visibleDialogTitle" max-width="600" persistent>
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        Editar Título o Descripción
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogTitle"
        ></v-btn>
      </v-card-title>

      <v-divider class="mb-4"></v-divider>

      <v-card-text>
        <v-col cols="12">
          <v-form ref="formRef">
            <v-col cols="12">
              <v-text-field
                v-model="setTitle"
                label="Título"
                color="primary"
                base-color="primary"
                density="comfortable"
                variant="solo-filled"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="setDescription"
                label="Descripción"
                color="primary"
                base-color="primary"
                variant="solo-filled"
                rows="3"
                clearable
              ></v-textarea>
            </v-col>
          </v-form>
        </v-col>
      </v-card-text>

      <v-divider class="mt-2"></v-divider>

      <v-card-actions class="my-2 d-flex justify-end">
        <v-btn
          class="text-none"
          rounded="lg"
          text="Cancelar"
          @click="closeDialogTitle"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="lg"
          text="Guardar"
          variant="flat"
          :loading="loadingBtnTitle"
          @click=""
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialogo de Editar Imagen o Titulo en la Tarjeta -->
  <v-dialog v-model="visibleDialogTarget" max-width="600" persistent>
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        {{ titleDialogTarget }}
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogTarget"
        ></v-btn>
      </v-card-title>

      <v-divider class="mb-4"></v-divider>

      <v-col cols="12" v-if="imgEdit">
        <v-card>
          <v-img
            class="bg-grey-lighten-2"
            max-height="125"
            :src="imgEdit"
          ></v-img>
          <v-card-title class="text-h6"> Imagen Actual </v-card-title>
        </v-card>
      </v-col>

      <v-card-text>
        <v-col cols="12">
          <v-file-upload
            title="Arrastra o selecciona una imagen"
            :density="density"
            accept="image/png, image/jpeg, image/bmp"
            @change="onFileChange"
          ></v-file-upload>
          <!-- Mostrar el mensaje de error debajo del componente de carga de archivos -->
          <span v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </span>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="setTitleTarget"
            label="Título de la Tarjeta"
            color="primary"
            base-color="primary"
            density="comfortable"
            variant="solo-filled"
            clearable
          ></v-text-field>
        </v-col>
      </v-card-text>

      <v-divider class="mt-2"></v-divider>

      <v-card-actions class="my-2 d-flex justify-end">
        <v-btn
          class="text-none"
          rounded="lg"
          text="Cancelar"
          @click="closeDialogTarget"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="lg"
          text="Guardar"
          variant="flat"
          :loading="loadingBtnEditTarget"
          @click=""
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import axios from "axios";
import { shallowRef, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { graphqlServerUrl, graphqlImagesUrl } from "@/graphql/config";
import {
  checkLocalStorageData,
  getTokenRefreshKeyCollaborator,
} from "@/graphql/utils";
import { PublicationPublicQueries } from "@/graphql/queries/publication_queries";
import { PublicationMutations } from "@/graphql/mutations/publication_mutations";

const density = shallowRef("compact");
const router = useRouter();

const visibleDialogTitle = ref(false);
const visibleDialogTarget = ref(false);
const titleDialogTarget = ref("");
const setTitle = ref("");
const setDescription = ref("");
const setTitleTarget = ref("");
const loadingBtnTitle = ref(false);
const loadingBtnEditTarget = ref(false);
const loadingData = ref(false);
const errorMessage = ref("");
const imgEdit = ref(null);
const codeError = ref("");
const visibleError = ref(false);
const textDialog = ref("");
const dataSection = ref({
  title: "",
  description: "",
});
const links = ref([]);

const getDataInterestLinks = async (id) => {
  loadingData.value = true;
  const initialQuery = PublicationPublicQueries.getCmsItemList(id);
  try {
    const response = await axios.post(graphqlServerUrl, {
      query: initialQuery,
    });

    const { data } = response;

    if (data && data.data) {
      const { status_code, status_message, cms_items } = data.data.cmsItemList;

      if (status_code === 200 && cms_items.length > 0) {
        dataSection.value.title = cms_items[0].cms_item_title;
        dataSection.value.description = cms_items[0].text_add;
        console.log(cms_items);

        const sections = cms_items[0].sections || [];

        // Transformar los datos de sections en el formato de links
        links.value = sections.map((section) => ({
          name: section.section_title,
          image:
            `${graphqlImagesUrl}/${section.url_header_image}` ||
            "default-image.jpg", // Imagen por defecto si es null
          socials: section.entryes.map((entry) => ({
            icon: mapSocialIcon(entry.entry_title), // Convertir el título en icono
          })),
        }));
        loadingData.value = false;
 
        console.log(links.value); // Verifica que los datos se actualizan correctamente
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

const mapSocialIcon = (entryTitle) => {
  return `${graphqlImagesUrl}img-social/${entryTitle}.png`;
};

// Función que maneja el cambio de archivo
const onFileChange = (event) => {
  // Acceder a los archivos seleccionados desde el evento
  const files = event.target.files;

  // Verificar si hay archivos seleccionados
  if (files.length > 0) {
    uploadedFile.value = files[0]; // Tomar el primer archivo
  } else {
    uploadedFile.value = null;
  }

  // Verificar el archivo cargado
  //console.log("Archivo asignado:", uploadedFile.value);
};

const handleError = (response) => {
  codeError.value = `Error: ${response.code}`;
  textDialog.value = response.message;
  visibleError.value = true;
};

const openDialogEditSection = () => {
  visibleDialogTitle.value = true;
};

const closeDialogTitle = () => {
  visibleDialogTitle.value = false;
};

const openDialogEditTarget = () => {
  visibleDialogTarget.value = true;
};

const closeDialogTarget = () => {
  visibleDialogTarget.value = false;
};

onMounted(async () => {
  const tokenExists = checkLocalStorageData("TokenCollaboratorCms");

  // Lógica basada en si el token existe o no
  if (tokenExists) {
    //console.log("EXISTE");
    await getDataInterestLinks(8);
  } else {
    router.push("/");
  }
});
</script>

<style scoped>
.circular-image {
  width: 150px; /* Asegura que el ancho y la altura sean iguales */
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #1c8c81; /* Opcional: añade un borde */
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

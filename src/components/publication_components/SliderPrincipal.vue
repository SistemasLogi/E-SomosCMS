<template>
  <v-container>
    <v-row class="mt-12 ml-2">
      <h2>Editar Slider Principal</h2>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-alert type="info" variant="tonal">
          <p style="color: black">
            En esta sección podrás editar las imagenes del slider principal, los
            botones de acción te permiten hacer lo siguiente:
          </p>
          <v-icon color="primary">mdi-pencil-box</v-icon
          ><span style="color: black">
            <b>Editar:</b> Cambiar la imagen de una posición creada</span
          >
          <br />
          <v-icon color="primary">mdi-trash-can</v-icon
          ><span style="color: black"
            ><b>Eliminar:</b> Eliminar una imagen y la posición
            correspondiente</span
          >
          <br />
          <p style="color: black">
            Para crear una nueva imagen, simplemente haz clic en el botón de
            "Nuevo" en la parte superior de la tabla.
          </p>
        </v-alert>
      </v-col>
    </v-row>
    <v-card class="mt-5">
      <v-row class="ma-2">
        <v-col cols="12" lg="6" v-if="loadingCarousel">
          <v-skeleton-loader
            class="mx-auto border"
            type="image"
          ></v-skeleton-loader>
        </v-col>
        <v-col cols="12" lg="6" v-if="!loadingCarousel">
          <v-carousel>
            <v-carousel-item
              v-for="(item, index) in itemsCarousel"
              :key="index"
              :src="item.url_header_image"
              cover
            ></v-carousel-item>
          </v-carousel>
        </v-col>
        <v-col cols="12" lg="6">
          <v-card-title class="d-flex align-center pe-2">
            Imagenes del Slider &nbsp;
            <v-spacer></v-spacer>

            <v-btn
              class="text-none"
              color="primary"
              rounded="lg"
              density="comfortable"
              append-icon="mdi-image-plus"
              >Nuevo</v-btn
            >
          </v-card-title>

          <v-divider></v-divider>
          <v-data-table
            :search="search"
            :headers="headers"
            :items="itemsCarousel"
            :loading="loading"
          >
            <template v-slot:header.stock>
              <div class="text-end">Stock</div>
            </template>

            <template v-slot:item.url_header_image="{ item }">
              <v-card class="my-2" elevation="2" rounded>
                <v-img :src="item.url_header_image" height="85" cover></v-img>
              </v-card>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-icon
                class="me-2"
                size="large"
                color="primary"
                v-tooltip:top="'Editar imagen'"
                @click=""
              >
                mdi-pencil-box
              </v-icon>
              <v-icon
                size="large"
                color="primary"
                v-tooltip:top="'Eliminar imagen'"
                @click=""
              >
                mdi-trash-can
              </v-icon>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
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
import { shallowRef, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { graphqlServerUrl, graphqlImagesUrl } from "@/graphql/config";
import {
  checkLocalStorageData,
  getTokenRefreshKeyCollaborator,
} from "@/graphql/utils";
import { PublicationPublicQueries } from "@/graphql/queries/publication_queries";
import { PublicationMutations } from "@/graphql/mutations/publication_mutations";

const search = ref("");
const textDialog = ref("");
const codeError = ref("");
const visibleError = ref(false);
const loading = ref(true);
const loadingCarousel = ref(true);
const headers = ref([
  {
    title: "Id",
    align: "start",
    sortable: false,
    key: "id",
  },
  { title: "Imagen", key: "url_header_image" },
  { title: "sección", key: "section_type" },
  { title: "Acciones", key: "actions" },
]);
const itemsCarousel = ref([]);

const getDataMenu = async (id) => {
  const initialQuery = PublicationPublicQueries.getCmsItemList(id);
  try {
    const response = await axios.post(graphqlServerUrl, {
      query: initialQuery,
    });

    const { data } = response;

    if (data && data.data) {
      const { status_code, status_message, cms_items } = data.data.cmsItemList;

      if (status_code === 200 && cms_items.length > 0) {
        // Extraer las secciones de tipo "carousel" y asignarlas a itemsCarousel
        const sections = cms_items[0].sections.filter(
          (section) => section.section_type === "carousel"
        );

        // Formatear los datos según los headers definidos
        itemsCarousel.value = sections.map((section) => ({
          id: section.id,
          url_header_image: `${graphqlImagesUrl}/${section.url_header_image}`,
          section_type: section.section_type,
        }));

        loadingCarousel.value = false;
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
    loading.value = false;
  }
};

const handleError = (response) => {
  codeError.value = `Error: ${response.code}`;
  textDialog.value = response.message;
  visibleError.value = true;
};

const closeDialog = () => {
  visibleError.value = false;
};

onMounted(async () => {
  const tokenExists = checkLocalStorageData("TokenCollaboratorCms");

  // Lógica basada en si el token existe o no
  if (tokenExists) {
    console.log("EXISTE");
    await getDataMenu(1);
  } else {
    router.push("/");
  }
});
</script>

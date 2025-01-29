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
              @click="openDialogUpload"
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
                @click="editSection(item.id, item.url_header_image)"
              >
                mdi-pencil-box
              </v-icon>
              <v-icon
                size="large"
                color="primary"
                v-tooltip:top="'Eliminar imagen'"
                @click="confirmDelete(item.id, item.url_header_image)"
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
  <v-dialog v-model="visibleDialogUpload" max-width="600" persistent>
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        {{ titleDialogUpload }}
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogUpload"
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
      </v-card-text>

      <v-divider class="mt-2"></v-divider>

      <v-card-actions class="my-2 d-flex justify-end">
        <v-btn
          class="text-none"
          rounded="lg"
          text="Cancelar"
          @click="closeDialogUpload"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="lg"
          text="Guardar"
          variant="flat"
          :loading="loadingBtn"
          @click="validateDataForm(1)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="visibleDialogConfirm" max-width="600px" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        Confirmar...
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogConfirm"
        ></v-btn>
      </v-card-title>
      <v-divider class="mt-3"></v-divider>
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
      <v-card-text
        ><v-alert :title="titleConfirm" type="warning" variant="tonal"
          ><p style="color: black">{{ textDialogConfirm }}</p></v-alert
        >
      </v-card-text>
      <v-divider class="mt-3"></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="primary" text @click="closeDialogConfirm"
          >No
        </v-btn>
        <v-btn
          color="primary"
          text="Si"
          variant="tonal"
          :loading="loadingBtn"
          @click="executeConfirmAction"
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

const search = ref("");
const textDialog = ref("");
const codeError = ref("");
const visibleError = ref(false);
const loading = ref(true);
const loadingCarousel = ref(true);
const visibleDialogUpload = ref(false);
const imgEdit = ref(null);
const errorMessage = ref("");
const titleDialogUpload = ref("");
const uploadedFile = ref(null);
const loadingBtn = ref(false);
const idSection = ref(null);
const allowedFormats = ["image/jpeg", "image/png", "image/bmp", "image/jpg"];
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
const visibleDialogConfirm = ref(false);
const titleConfirm = ref("");
const textDialogConfirm = ref("");

const router = useRouter();

const getDataSlider = async (id) => {
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

const upsertSectionWithImage = async (
  sectionId,
  cmsItemId,
  sectionTitle,
  sectionType,
  fileImgHeader
) => {
  loadingBtn.value = true;
  const initialMutation = PublicationMutations.setUpsertSection({
    id: sectionId,
    cms_item_id: cmsItemId,
    section_title: sectionTitle,
    section_type: sectionType,
    img_header: true,
  });

  console.log("Query generado:", initialMutation);

  const token = localStorage.TokenCollaboratorCms;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };

  const formData = new FormData();
  formData.append(
    "operations",
    JSON.stringify({
      query: initialMutation,
      variables: {
        img_header: null,
      },
    })
  );
  formData.append("map", JSON.stringify({ 1: ["variables.img_header"] }));
  formData.append("1", fileImgHeader);

  const datos = await axios.post(graphqlServerUrl, formData, { headers });
  console.log(datos.data.data);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, section } =
        dataMutation.upsertSection;

      if (status_code === 200 || status_code === 201) {
        loadingBtn.value = false;
        idSection.value = null;
        imgEdit.value = null;
        await getDataSlider(1);
        closeDialogUpload();
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(
          upsertSectionWithImage(
            sectionId,
            cmsItemId,
            sectionTitle,
            sectionType,
            fileImgHeader
          )
        );
      } else {
        handleError({
          code: 500,
          message: "Error inesperado al actualizar la sección",
        });
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(
        upsertSectionWithImage(
          sectionId,
          cmsItemId,
          sectionTitle,
          sectionType,
          fileImgHeader
        )
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const deleteSection = async (sectionId) => {
  loadingBtn.value = true;
  const deleteMutation = PublicationMutations.setDeleteSection(sectionId);

  const token = localStorage.TokenCollaboratorCms;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const datos = await axios.post(
    graphqlServerUrl,
    {
      query: deleteMutation,
    },
    { headers }
  );
  console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message } = dataMutation.deleteSection;

      if (status_code === 200) {
        loadingBtn.value = false;
        idSection.value = null;
        imgEdit.value = null;
        await getDataSlider(1);
        closeDialogConfirm();
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(deleteSection(sectionId));
      } else {
        handleError({
          code: 500,
          message: "Error inesperado al actualizar la sección",
        });
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(deleteSection(sectionId));
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const refreshTokenAndRetry = async (callback) => {
  const encriptedKey = localStorage.EncryptedKeyCollaboratorCms;
  const responseRefresh = await getTokenRefreshKeyCollaborator(encriptedKey);

  if (responseRefresh.code === 200) {
    //console.log(responseRefresh.message);
    await callback();
  } else {
    handleError({
      code: responseRefresh.code,
      message: responseRefresh.message,
    });
  }
};

const editSection = (id, imageEdit) => {
  titleDialogUpload.value = "Cambiar Imagen";
  imgEdit.value = imageEdit;
  idSection.value = id;
  visibleDialogUpload.value = true;
  //console.log("ID de la sección a editar:", idSection.value);
  //console.log("URL de la imagen a editar:", imgEdit.value);
};

const openDialogUpload = () => {
  titleDialogUpload.value = "Subir Imagen";
  idSection.value = null;
  imgEdit.value = null;
  visibleDialogUpload.value = true;
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

// Función para validar los datos del formulario (archivo cargado)
const validateDataForm = async () => {
  // Validar que se ha cargado un archivo
  if (!uploadedFile.value) {
    errorMessage.value = "No se ha cargado ningún archivo."; // Mensaje de error si no se cargó archivo
    return;
  }

  // Validar que el archivo sea una instancia de File
  if (!(uploadedFile.value instanceof File)) {
    errorMessage.value = "El archivo seleccionado no es válido."; // Mensaje de error si no es un archivo válido
    return;
  }

  // Validar el formato del archivo (tipo MIME)
  if (!allowedFormats.includes(uploadedFile.value.type)) {
    errorMessage.value = "Formato de imagen no válido. Use JPG, PNG o BMP."; // Mensaje de error si el formato no es válido
    return;
  }

  // Si pasa todas las validaciones, entonces se puede continuar
  //console.log("Archivo válido:", uploadedFile.value);

  upsertSectionWithImage(
    idSection.value,
    1,
    "image",
    "carousel",
    uploadedFile.value
  );
};

const confirmDelete = (id, image) => {
  titleConfirm.value = "Eliminar Imagen";
  textDialogConfirm.value = "¿Desea eliminar la imagen?";
  idSection.value = id;
  imgEdit.value = image;
  visibleDialogConfirm.value = true;
};

const executeConfirmAction = async () => {
  await deleteSection(idSection.value);
};

const handleError = (response) => {
  codeError.value = `Error: ${response.code}`;
  textDialog.value = response.message;
  visibleError.value = true;
};

const closeDialog = () => {
  visibleError.value = false;
};

const closeDialogUpload = () => {
  visibleDialogUpload.value = false;
  errorMessage.value = "";
  uploadedFile.value = null;
};

const closeDialogConfirm = () => {
  visibleDialogConfirm.value = false;
  idSection.value = null;
  imgEdit.value = null;
};

onMounted(async () => {
  const tokenExists = checkLocalStorageData("TokenCollaboratorCms");

  // Lógica basada en si el token existe o no
  if (tokenExists) {
    //console.log("EXISTE");
    await getDataSlider(1);
  } else {
    router.push("/");
  }
});
</script>

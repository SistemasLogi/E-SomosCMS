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
        @click="openDialogHeader"
      ></v-btn>

      <!-- Título de la sección -->
      <v-row justify="center" class="ma-5">
        <v-col cols="12" class="text-center">
          <h2 class="text-h4 font-weight-bold">{{ cmsTitle }}</h2>
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
      <v-container style="max-width: 1320px">
        <v-row justify="center" class="mt-5 mb-5" v-if="loadingData">
          <v-col cols="12" lg="4">
            <v-skeleton-loader
              class="mx-auto border"
              type="avatar, heading, text"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
        <!-- Tarjetas de enlaces -->
        <v-row
          justify="center"
          class="mt-5 mb-5 ml-12 mr-12"
          v-if="!loadingData"
        >
          <v-col cols="12" sm="6" lg="4" v-for="section in sectionAbout">
            <v-card rounded="lg" style="height: 300px">
              <v-card-text>
                <v-avatar color="primary" size="50" @click="">
                  <i
                    :class="section.section_type"
                    style="font-size: 20px; color: white"
                  ></i>
                </v-avatar>
              </v-card-text>
              <v-card-title
                ><h3>{{ section.section_title }}</h3></v-card-title
              >
              <v-card-text>
                <p>
                  {{ section.section_description }}
                </p>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  color="primary"
                  v-tooltip:top="'Editar sección'"
                  @click="openDialogEditSection(section)"
                ></v-btn>
                <v-btn
                  icon="mdi-trash-can"
                  color="error"
                  variant="text"
                  v-tooltip:top="'Eliminar sección'"
                  @click="openDialogConfirmSection(section)"
                ></v-btn>
                <v-btn
                  icon="mdi-file-document-edit"
                  color="dark"
                  variant="text"
                  v-tooltip:top="'Configurar entrada'"
                  @click="configureEntry(section)"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" lg="4">
            <v-card
              rounded="lg"
              class="add-card d-flex flex-column align-center text-center pa-4"
              @click="openDialogEditSection(null)"
            >
              <v-btn
                icon="mdi-plus"
                color="primary"
                fab
                class="floating-btn animate-pulse"
              ></v-btn>
              <v-card-title class="responsive-title mt-3"
                >Agregar Nueva Sección</v-card-title
              >
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>

  <!-- Dialogo de Editar Imagen o Titulo en la Cabecera -->
  <v-dialog v-model="visibleDialogHeader" max-width="600" persistent>
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        {{ titleDialogHeader }}
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogHeader"
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
          <v-card-title
            class="text-h6 d-flex justify-space-between align-center"
          >
            Imagen Actual
            <v-btn
              icon="mdi-trash-can"
              color="error"
              variant="text"
              @click="openDialogConfirmHeader"
              v-tooltip:top="'Eliminar Imagen'"
            ></v-btn>
          </v-card-title>
        </v-card>
      </v-col>

      <v-card-text>
        <v-form ref="formHeader">
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
              v-model="setTitleHeader"
              label="Título de la cabecera de la página"
              color="primary"
              base-color="primary"
              density="comfortable"
              variant="solo-filled"
              clearable
              :rules="[rules.maxLengthRule(45)]"
            ></v-text-field>
          </v-col>
        </v-form>
      </v-card-text>

      <v-divider class="mt-2"></v-divider>

      <v-card-actions class="my-2 d-flex justify-end">
        <v-btn
          class="text-none"
          rounded="lg"
          text="Cancelar"
          @click="closeDialogHeader"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="lg"
          text="Guardar"
          variant="flat"
          :loading="loadingBtnEditHeader"
          @click="validateDataForm"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialogo de Confirmar Eliminar imagen en cabecera -->
  <v-dialog v-model="visibleDialogConfirmHeader" max-width="600px" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        Confirmar...
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogConfirmHeader"
        ></v-btn>
      </v-card-title>
      <v-divider class="mt-3"></v-divider>
      <v-card-text
        ><v-alert title="Eliminar Imagen" type="warning" variant="tonal"
          ><p style="color: black">
            Desea eliminar la imagen del encabezado para esta página?
          </p>
        </v-alert>
      </v-card-text>
      <v-divider class="mt-3"></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          color="primary"
          text
          @click="closeDialogConfirmHeader"
          >No
        </v-btn>
        <v-btn
          color="primary"
          text="Si"
          variant="tonal"
          :loading="loadingBtnDeleteImage"
          @click="executeDeleteImage"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialogo de Editar Título o Descripción en sección -->
  <v-dialog v-model="visibleDialogEditSection" max-width="700" persistent>
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        Editar Sección
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogSection"
        ></v-btn>
      </v-card-title>

      <v-divider class="mb-4"></v-divider>

      <!-- Sección para seleccionar el ícono -->
      <v-card-text class="d-flex align-center">
        <v-avatar
          color="primary"
          size="50"
          @click="openIconGallery"
          class="cursor-pointer"
          v-tooltip:top="'Seleccionar un ícono'"
        >
          <i :class="selectedIcon" style="font-size: 24px; color: white"></i>
        </v-avatar>
        <span class="ml-3">{{
          selectedIconName || "Selecciona un ícono"
        }}</span>
      </v-card-text>

      <v-divider class="mt-2"></v-divider>

      <!-- Formulario para editar la sección -->

      <v-card-text>
        <v-col cols="12">
          <v-form ref="formSection">
            <v-col cols="12">
              <v-text-field
                v-model="setTitleSection"
                label="Título sección"
                color="primary"
                base-color="primary"
                density="comfortable"
                variant="solo-filled"
                clearable
                :rules="[rules.maxLengthRule(100)]"
                hint="El título de la sección es el mismo que la cabecera de la página de entrada."
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="setDescriptionSection"
                label="Descripción sección"
                color="primary"
                base-color="primary"
                variant="solo-filled"
                rows="3"
                clearable
                :rules="[rules.maxLengthRule(160)]"
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
          @click="closeDialogSection"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="lg"
          text="Guardar"
          variant="flat"
          :loading="loadingBtnSection"
          @click="validateDataFormSection"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Segundo diálogo para la galería de íconos -->
  <v-dialog v-model="visibleIconGallery" max-width="600">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        Selecciona un Ícono
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="visibleIconGallery = false"
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-row dense>
          <v-col cols="6" md="3" v-for="icon in icons" :key="icon.name">
            <v-card
              class="d-flex flex-column align-center justify-center pa-3"
              hover
              @click="selectIcon(icon)"
            >
              <v-avatar color="primary" size="50">
                <i
                  :class="icon.class"
                  style="font-size: 24px; color: white"
                ></i>
              </v-avatar>
              <div class="mt-2 text-center text-caption">{{ icon.name }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Dialogo de Error -->
  <v-dialog v-model="visibleError" persistent max-width="500px">
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

  <!-- Dialogo de Confirmar Eliminar una sección -->
  <v-dialog v-model="visibleDialogConfirmSection" max-width="600px" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        Confirmar...
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogConfirmSection"
        ></v-btn>
      </v-card-title>
      <v-divider class="mt-3"></v-divider>
      <v-card-text
        ><v-alert
          :title="titleConfirmDeleteSection"
          type="warning"
          variant="tonal"
          ><p style="color: black">
            {{ textDialogConfirmDeleteSection }}
          </p>
        </v-alert>
      </v-card-text>
      <v-divider class="mt-3"></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          color="primary"
          text
          @click="closeDialogConfirmSection"
          >No
        </v-btn>
        <v-btn
          color="primary"
          text="Si"
          variant="tonal"
          :loading="loadingBtnDeleteSection"
          @click="executeDeleteSection"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import axios from "axios";
import { shallowRef, ref, onMounted } from "vue";
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

const setTitleHeader = ref("");
const setTitleSection = ref("");
const formSection = ref(null);
const setDescriptionSection = ref("");
const loadingBtnSection = ref(false);
const imgEdit = ref(null);
const visibleDialogHeader = ref(false);
const visibleDialogConfirmHeader = ref(false);
const visibleDialogEditSection = ref(false);
const visibleError = ref(false);
const visibleDialogConfirmSection = ref(false);
const errorMessage = ref("");
const titleDialogHeader = ref("");
const loadingBtnEditHeader = ref(false);
const loadingBtnDeleteImage = ref(false);
const loadingData = ref(false);
const loadingBtnDeleteSection = ref(false);
const uploadedFile = ref(null);
const cmsTitle = ref("");
const imagenBanner = ref("");
const sectionAbout = ref([]);
const formHeader = ref(null);
const codeError = ref("");
const textDialog = ref("");
const idSectionEdit = ref(null);
const allowedFormats = ["image/jpeg", "image/png", "image/bmp", "image/jpg"];
const icons = [
  { name: "Calendar Week", class: "bi bi-calendar-week" },
  { name: "Clipboard Data", class: "bi bi-clipboard-data" },
  { name: "Journal Richtext", class: "bi bi-journal-richtext" },
  { name: "People", class: "bi bi-people" },
  { name: "Person Lock", class: "bi bi-person-lock" },
  { name: "Briefcase", class: "bi bi-briefcase" },
  { name: "Bar Chart", class: "bi bi-bar-chart" },
  { name: "Building", class: "bi bi-building" },
  { name: "Cash Stack", class: "bi bi-cash-stack" },
  { name: "Credit Card", class: "bi bi-credit-card" },
  { name: "Database", class: "bi bi-database" },
  { name: "File EarMark Text", class: "bi bi-file-earmark-text" },
  { name: "Gear", class: "bi bi-gear" },
  { name: "Graph Up", class: "bi bi-graph-up" },
  { name: "Grid", class: "bi bi-grid" },
  { name: "Laptop", class: "bi bi-laptop" },
  { name: "Pie Chart", class: "bi bi-pie-chart-fill" },
  { name: "Safe", class: "bi bi-safe" },
  { name: "Wallet", class: "bi bi-wallet" },
  { name: "Clipboard Check", class: "bi bi-clipboard-check" },
  { name: "Image", class: "bi bi-image-fill" },
  { name: "Card Text", class: "bi bi-card-text" },
  { name: "Archive", class: "bi bi-archive" },
  { name: "Person", class: "bi bi-person" },
];
const visibleIconGallery = ref(false); // Segundo diálogo para los íconos
const selectedIcon = ref("bi bi-card-text"); // Ícono por defecto
const selectedIconName = ref("");
const titleConfirmDeleteSection = ref("");
const textDialogConfirmDeleteSection = ref("");
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

const getDataAboutPage = async (id) => {
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
        cmsTitle.value = cms_items[0].cms_item_title;
        imagenBanner.value = `${graphqlImagesUrl}/${cms_items[0].url_header_image}`;
        sectionAbout.value = cms_items[0].sections;

        loadingData.value = false;

        console.log(cms_items);
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

const updateItemPageWithImage = async (
  itemId,
  itemTitle,
  fileImgHeader,
  textAdd
) => {
  loadingBtnEditHeader.value = true;
  const initialMutation = PublicationMutations.setUpdateItemWithImage(
    itemId,
    itemTitle,
    textAdd
  );

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
        file_image: null,
      },
    })
  );
  formData.append("map", JSON.stringify({ 1: ["variables.file_image"] }));
  formData.append("1", fileImgHeader);

  const datos = await axios.post(graphqlServerUrl, formData, { headers });
  console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, cms_item } =
        dataMutation.updatePrincipalItem;

      if (status_code === 200) {
        await getDataAboutPage(2);
        closeDialogHeader();
        loadingBtnEditHeader.value = false;
        uploadedFile.value = null;
        imgEdit.value = null;
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() =>
          updateItemPageWithImage(itemId, itemTitle, fileImgHeader, textAdd)
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
      await refreshTokenAndRetry(() =>
        updateItemPageWithImage(itemId, itemTitle, fileImgHeader, textAdd)
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

// Actualizar la sección de cabecera
const updateItemPage = async (itemId, itemTitle, textAdd) => {
  loadingBtnEditHeader.value = true;
  const updateMutation = PublicationMutations.setUpdateItemWithoutImage(
    itemId,
    itemTitle,
    textAdd
  );

  const token = localStorage.TokenCollaboratorCms;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const datos = await axios.post(
    graphqlServerUrl,
    {
      query: updateMutation,
    },
    { headers }
  );
  console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, cms_item } =
        dataMutation.updatePrincipalItemNotImage;

      if (status_code === 200) {
        await getDataAboutPage(2);
        loadingBtnEditHeader.value = false;
        closeDialogHeader();
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() =>
          updateItemPage(itemId, itemTitle, textAdd)
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
      await refreshTokenAndRetry(() =>
        updateItemPage(itemId, itemTitle, textAdd)
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

// Eliminar imagen de el encabezado
const deleteimageHeader = async (itemId) => {
  loadingBtnDeleteImage.value = true;
  const updateMutation = PublicationMutations.setDeleteImageHeaderItem(itemId);

  const token = localStorage.TokenCollaboratorCms;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const datos = await axios.post(
    graphqlServerUrl,
    {
      query: updateMutation,
    },
    { headers }
  );
  console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, cms_item } =
        dataMutation.deletePrincipalItemImage;

      if (status_code === 200) {
        await getDataAboutPage(2);
        loadingBtnDeleteImage.value = false;
        closeDialogConfirmHeader();
        closeDialogHeader();
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() => deleteimageHeader(itemId));
      } else {
        handleError({
          code: 500,
          message: "Error inesperado al actualizar la sección",
        });
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(() => deleteimageHeader(itemId));
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const executeDeleteImage = async () => {
  await deleteimageHeader(2);
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

const validateDataForm = async () => {
  const { valid } = await formHeader.value.validate();

  if (!valid) {
    return;
  }

  // Validar que se ha cargado un archivo
  if (!uploadedFile.value) {
    updateItemPage(2, setTitleHeader.value, "");
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

  updateItemPageWithImage(2, setTitleHeader.value, uploadedFile.value, "");
};

const validateDataFormSection = async () => {
  const { valid } = await formSection.value.validate();
  if (valid) {
    await upsertSectionWithOutImage(
      idSectionEdit.value,
      2,
      setTitleSection.value,
      setDescriptionSection.value,
      selectedIcon.value
    );
  }
};

// Actualizar o crear una sección sin imagen
const upsertSectionWithOutImage = async (
  sectionId,
  cmsItemId,
  sectionTitle,
  sectionDescription,
  sectionType
) => {
  loadingBtnSection.value = true;
  const updateMutation = PublicationMutations.setUpsertSectionWithoutImage({
    id: sectionId,
    cms_item_id: cmsItemId,
    section_title: sectionTitle,
    section_description: sectionDescription,
    section_type: sectionType,
  });

  const token = localStorage.TokenCollaboratorCms;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const datos = await axios.post(
    graphqlServerUrl,
    {
      query: updateMutation,
    },
    { headers }
  );
  console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, section } =
        dataMutation.upsertSection;

      if (status_code === 200 || status_code === 201) {
        await getDataAboutPage(2);
        loadingBtnSection.value = false;
        closeDialogSection();
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() =>
          upsertSectionWithOutImage(
            sectionId,
            cmsItemId,
            sectionTitle,
            sectionDescription,
            sectionType
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
      await refreshTokenAndRetry(() =>
        upsertSectionWithOutImage(
          sectionId,
          cmsItemId,
          sectionTitle,
          sectionDescription,
          sectionType
        )
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

// Eliminar una sección
const deleteSection = async (sectionId) => {
  loadingBtnDeleteSection.value = true;
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
        await getDataAboutPage(2);
        closeDialogConfirmSection();
        loadingBtnDeleteSection.value = false;
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() => deleteSection(sectionId));
      } else {
        handleError({
          code: 500,
          message: "Error inesperado al actualizar la sección",
        });
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(() => deleteSection(sectionId));
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

const executeDeleteSection = async () => {
  await deleteSection(idSectionEdit.value);
};

// Abrir el diálogo de galería de íconos
const openIconGallery = () => {
  visibleIconGallery.value = true;
};

// Seleccionar un ícono y cerrar el diálogo de íconos
const selectIcon = (icon) => {
  selectedIcon.value = icon.class;
  selectedIconName.value = icon.name;
  visibleIconGallery.value = false;
};

const handleError = (response) => {
  codeError.value = `Error: ${response.code}`;
  textDialog.value = response.message;
  visibleError.value = true;
};

const openDialogHeader = () => {
  setTitleHeader.value = cmsTitle.value;
  imgEdit.value = imagenBanner.value;
  titleDialogHeader.value = "Editar Cabecera";
  visibleDialogHeader.value = true;
};

const openDialogConfirmHeader = () => {
  visibleDialogConfirmHeader.value = true;
};

const openDialogEditSection = (section) => {
  if (section) {
    setTitleSection.value = section.section_title;
    setDescriptionSection.value = section.section_description;
    selectedIcon.value = section.section_type;
    visibleDialogEditSection.value = true;
    idSectionEdit.value = section.id;
    console.log(section);
  } else {
    visibleDialogEditSection.value = true;
    setTitleSection.value = "";
    setDescriptionSection.value = "";
    selectedIcon.value = "bi bi-card-text";
    idSectionEdit.value = null;
  }
};

const openDialogConfirmSection = (section) => {
  titleConfirmDeleteSection.value = "Eliminar Sección " + section.section_title;
  textDialogConfirmDeleteSection.value =
    "¿Desea eliminar la sección " + section.section_title + "?";
  idSectionEdit.value = section.id;
  visibleDialogConfirmSection.value = true;
};

const closeDialogConfirmSection = () => {
  loadingBtnDeleteSection.value = false;
  visibleDialogConfirmSection.value = false;
};

const closeDialogHeader = () => {
  visibleDialogHeader.value = false;
  setTitleHeader.value = "";
  imgEdit.value = null;
  errorMessage.value = "";
  uploadedFile.value = null;
  loadingBtnEditHeader.value = false;
};

const closeDialogConfirmHeader = () => {
  visibleDialogConfirmHeader.value = false;
  loadingBtnDeleteImage.value = false;
};

const closeDialogSection = () => {
  visibleDialogEditSection.value = false;
  loadingBtnSection.value = false;
};

const closeDialog = () => {
  closeDialogHeader();
  closeDialogConfirmHeader();
  closeDialogSection();
  closeDialogConfirmSection();
  visibleError.value = false;
};

const slugify = (text) => {
  return text
    .normalize("NFD") // Normaliza caracteres con tildes
    .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos (acentos, tildes)
    .replace(/[^a-zA-Z0-9\s-]/g, "") // Elimina caracteres especiales
    .trim() // Elimina espacios al inicio y final
    .replace(/\s+/g, "-") // Reemplaza espacios por guiones
    .toLowerCase(); // Convierte a minúsculas
};

const configureEntry = (section) => {
  console.log("Configurar Entrada:", section);
  const cleanTitle = slugify(section.section_title);

  router.push({
    name: "EntryAbout",
    params: { id: section.id, title: cleanTitle },
  });
};

onMounted(async () => {
  const tokenExists = checkLocalStorageData("TokenCollaboratorCms");

  // Lógica basada en si el token existe o no
  if (tokenExists) {
    //console.log("EXISTE");
    await getDataAboutPage(2);
  } else {
    router.push("/");
  }
});
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

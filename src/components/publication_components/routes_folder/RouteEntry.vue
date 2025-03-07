<template>
  <v-container>
    <v-row class="mt-12 ml-2">
      <h2>Editar Pagina Ruta</h2>
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
          <h2 class="text-h4 font-weight-bold">{{ sectionTitle }}</h2>
          <v-img class="mx-auto" :src="imagenBanner"></v-img>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="mt-5 pa-4">
      <v-container style="max-width: 1500px">
        <v-row justify="center" class="mt-5 mb-5" v-if="loadingData">
          <v-col cols="12" lg="3">
            <v-skeleton-loader
              class="mx-auto border"
              type="card, list-item-two-line"
            ></v-skeleton-loader>
          </v-col>
        </v-row>

        <v-col cols="12">
          <template v-for="(entry, index) in selectedEntries" :key="index">
            <!-- Renderizar imágenes -->
            <v-col v-if="entry.file_type === 'img'" cols="12">
              <v-row>
                <v-col cols="9">
                  <v-img
                    width="900px"
                    class="mx-auto"
                    :src="entry.url_file"
                  ></v-img>
                </v-col>
                <v-col cols="3">
                  <v-btn
                    icon
                    variant="text"
                    v-tooltip:top="'Editar imagen'"
                    @click="openDialogEntryImg(entry)"
                  >
                    <v-icon color="primary">mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    v-tooltip:top="'Eliminar imagen'"
                    @click="openDialogConfirmDelContent(entry)"
                  >
                    <v-icon color="danger">mdi-delete</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    v-tooltip:top="'Subir imagen'"
                    @click="moveUp(index)"
                    :disabled="index === 0"
                  >
                    <v-icon>mdi-arrow-up</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    v-tooltip:top="'Bajar imagen'"
                    @click="moveDown(index)"
                    :disabled="index === selectedEntries.length - 1"
                  >
                    <v-icon>mdi-arrow-down</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>

            <!-- Renderizar títulos -->
            <v-col v-else-if="entry.content_type?.startsWith('h')" cols="12">
              <v-row>
                <v-col cols="9">
                  <component :is="entry.content_type">{{
                    entry.content
                  }}</component>
                </v-col>
                <v-col cols="3">
                  <v-btn
                    icon
                    variant="text"
                    v-tooltip:top="'Editar título'"
                    @click="openDialogEntryContent(entry)"
                  >
                    <v-icon color="primary">mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    v-tooltip:top="'Eliminar título'"
                    @click="openDialogConfirmDelContent(entry)"
                  >
                    <v-icon color="danger">mdi-delete</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    v-tooltip:top="'Subir titulo'"
                    @click="moveUp(index)"
                    :disabled="index === 0"
                  >
                    <v-icon>mdi-arrow-up</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    v-tooltip:top="'Bajar titulo'"
                    @click="moveDown(index)"
                    :disabled="index === selectedEntries.length - 1"
                  >
                    <v-icon>mdi-arrow-down</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>

            <!-- Renderizar párrafos -->
            <v-col v-else-if="entry.content_type === 'p'" cols="12">
              <v-row>
                <v-col cols="9">
                  <p>{{ entry.content }}</p>
                </v-col>
                <v-col cols="3">
                  <v-btn
                    icon
                    variant="text"
                    v-tooltip:top="'Editar párrafo'"
                    @click="openDialogEntryContent(entry)"
                  >
                    <v-icon color="primary">mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    v-tooltip:top="'Eliminar párrafo'"
                    @click="openDialogConfirmDelContent(entry)"
                  >
                    <v-icon color="danger">mdi-delete</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    v-tooltip:top="'Subir párrafo'"
                    @click="moveUp(index)"
                    :disabled="index === 0"
                  >
                    <v-icon>mdi-arrow-up</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    v-tooltip:top="'Bajar párrafo'"
                    @click="moveDown(index)"
                    :disabled="index === selectedEntries.length - 1"
                  >
                    <v-icon>mdi-arrow-down</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </template>
        </v-col>

        <v-col cols="12">
          <v-btn
            color="primary"
            size="large"
            rounded="lg"
            block
            class="text-none"
            append-icon="mdi-sticker-plus"
            @click="openDialogAddContent"
          >
            Agregar Contenido
          </v-btn>
        </v-col>
      </v-container>
    </v-card>
  </v-container>

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
              label="Título de la cabecera de la página / sección"
              color="primary"
              base-color="primary"
              density="comfortable"
              variant="solo-filled"
              clearable
              :rules="[rules.maxLengthRule(100)]"
            ></v-text-field>
            <v-alert type="warning" variant="tonal">
              <p style="color: black">
                Al modificar el titulo se modifica también la sección en la
                página principal.
              </p>
            </v-alert>
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

  <!-- Dialogo de seleccionar tipo de contenido -->
  <v-dialog v-model="visibleDialogTypeContent" max-width="600" persistent>
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        Seleccione el tipo de contenido
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogTypeContent"
        ></v-btn>
      </v-card-title>

      <v-divider class="mb-4"></v-divider>

      <v-card-text>
        <v-radio-group v-model="radios" color="primary">
          <template v-slot:label>
            <div>
              Selecciona el tipo de <strong>contenido</strong> que quieres
              publicar
            </div>
          </template>
          <v-radio value="h2">
            <template v-slot:label>
              <div>
                <h3>Titulo</h3>
              </div>
            </template>
          </v-radio>
          <v-radio value="p">
            <template v-slot:label>
              <div>
                <p>Párrafo</p>
              </div>
            </template>
          </v-radio>
          <v-radio value="img">
            <template v-slot:label>
              <div>Imagen</div>
            </template>
          </v-radio>
        </v-radio-group>
      </v-card-text>

      <v-divider class="mt-2"></v-divider>

      <v-card-actions class="my-2 d-flex justify-end">
        <v-btn
          class="text-none"
          rounded="lg"
          text="Cancelar"
          @click="closeDialogTypeContent"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="lg"
          text="Continuar"
          variant="flat"
          @click="openDialogRequireContent"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialogo de Subir Imagen en entry file -->
  <v-dialog v-model="visibleDialogUploadImg" max-width="600" persistent>
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        {{ titleDialogUploadImg }}
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogUploadImg"
        ></v-btn>
      </v-card-title>

      <v-divider class="mb-4"></v-divider>

      <v-col cols="12" v-if="imgEditUpload">
        <v-card>
          <v-img
            class="bg-grey-lighten-2"
            max-height="125"
            :src="imgEditUpload"
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
            @change="onFileChangeEntryImg"
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
          @click="closeDialogUploadImg"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="lg"
          text="Guardar"
          variant="flat"
          :loading="loadingBtnUploadImg"
          @click="validateDataFormEntryImg"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialogo de Editar Contenido de Entrada -->
  <v-dialog v-model="visibleDialogEntryContent" max-width="600" persistent>
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        {{ titleDialogEntryContent }}
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogEntryContent"
        ></v-btn>
      </v-card-title>

      <v-divider class="mb-4"></v-divider>

      <v-card-text>
        <v-form ref="formEntryContent">
          <v-col cols="12" v-if="isParagraph">
            <v-alert class="mb-2" type="info" variant="tonal">
              <p style="color: black">
                Puedes crear o modificar un párrafo para el contenido de la
                entrada.
              </p>
            </v-alert>
            <v-textarea
              v-model="setTextEntryContent"
              :label="labelEntryContent"
              color="primary"
              base-color="primary"
              variant="solo-filled"
              rows="5"
              clearable
              :rules="[rules.required, rules.maxLengthRule(900)]"
            ></v-textarea>
          </v-col>
          <v-col cols="12" v-else>
            <v-alert class="mb-2" type="info" variant="tonal">
              <p style="color: black">
                Puedes crear o modificar un titulo para el contenido de la
                entrada.
              </p>
            </v-alert>
            <v-text-field
              v-model="setTextEntryContent"
              :label="labelEntryContent"
              color="primary"
              base-color="primary"
              density="comfortable"
              variant="solo-filled"
              clearable
              :rules="[rules.required, rules.maxLengthRule(250)]"
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
          @click="closeDialogEntryContent"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="lg"
          text="Guardar"
          variant="flat"
          :loading="loadingBtnEntryContent"
          @click="validateDataFormEntryContent"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialogo de Confirmar Eliminar imagen elemento de la lista -->
  <v-dialog v-model="visibleDialogConfirmContent" max-width="600px" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        Confirmar...
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogConfirmContent"
        ></v-btn>
      </v-card-title>
      <v-divider class="mt-3"></v-divider>
      <v-card-text
        ><v-alert
          title="Eliminar Elemento en el Contenido"
          type="warning"
          variant="tonal"
          ><p style="color: black">
            {{ messageContent }}
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
          @click="closeDialogConfirmContent"
          >No
        </v-btn>
        <v-btn
          color="primary"
          text="Si"
          variant="tonal"
          :loading="loadingBtnDeleteContent"
          @click="executeDeleteContent"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Overlay de Progreso -->
  <v-overlay
    :model-value="overlay"
    persistent
    class="align-center justify-center"
  >
    <v-responsive class="align-center text-center fill-height">
      <v-progress-circular
        color="primary"
        :size="120"
        :width="10"
        indeterminate
      ></v-progress-circular>
      <v-empty-state
        headline="Actualizando..."
        title="Espere un momento"
      ></v-empty-state>
    </v-responsive>
  </v-overlay>
</template>
<script setup>
import axios from "axios";
import { shallowRef, ref, onMounted, computed } from "vue";
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
const cmsItemIdThis = ref(null);
const sectionTypeThis = ref(null);
const imagenBanner = ref("");
const itemEntry = ref([]);
const orderedEntries = ref([]);
const visibleDialogHeader = ref(false);
const titleDialogHeader = ref("");
const setTitleHeader = ref("");
const imgEdit = ref(null);
const loadingBtnEditHeader = ref(false);
const errorMessage = ref(null);
const formHeader = ref(null);
const visibleDialogConfirmHeader = ref(false);
const uploadedFile = ref(null);
const loadingBtnDeleteImage = ref(false);
const visibleDialogTypeContent = ref(false);
const idEntryActive = ref(null);
const radios = ref("h2");
const visibleDialogUploadImg = ref(false);
const titleDialogUploadImg = ref("");
const entryFileSelected = ref({});
const loadingBtnUploadImg = ref(false);
const uploadedFileEntryImg = ref(null);
const entryContentSelected = ref({});
const visibleDialogEntryContent = ref(false);
const titleDialogEntryContent = ref("");
const setTextEntryContent = ref("");
const labelEntryContent = ref("");
const isParagraph = ref(false);
const loadingBtnEntryContent = ref(false);
const imgEditUpload = ref(null);
const formEntryContent = ref(null);
const visibleDialogConfirmContent = ref(false);
const messageContent = ref("");
const loadingBtnDeleteContent = ref(false);
const deleteItemContent = ref({});
const overlay = ref(false);
const allowedFormats = ["image/jpeg", "image/png", "image/bmp", "image/jpg"];
const responseMove = ref({
  operation: false,
  message: "",
});
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
  youtubeRule: (value) => {
    const youtubePattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)$/;
    return youtubePattern.test(value) || "URL de YouTube inválida";
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
        //console.log(sections);

        sectionTitle.value = sections[0].section_title;
        cmsItemIdThis.value = sections[0].cms_item_id;
        sectionTypeThis.value = sections[0].section_type;

        if (sections[0].url_header_image) {
          imagenBanner.value = `${graphqlImagesUrl}${sections[0].url_header_image}`;
        }

        itemEntry.value = sections[0].entryes;

        orderedEntries.value = combineAndSortEntries(itemEntry.value);
        //console.log(orderedEntries.value);

        loadingData.value = false;
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

const updateSectionWithImage = async (
  sectionId,
  cmsItemId,
  sectionTitle,
  fileImgHeader,
  sectionType
) => {
  loadingBtnEditHeader.value = true;
  const initialMutation = PublicationMutations.setUpsertSection({
    id: sectionId,
    cms_item_id: cmsItemId,
    section_title: sectionTitle,
    img_header: true,
    section_type: sectionType,
  });

  //console.log("Query generado:", initialMutation);

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
  //console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, section } =
        dataMutation.upsertSection;

      if (status_code === 200 || status_code === 201) {
        await getDataAboutSection(section.id);
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
          updateSectionWithImage(
            sectionId,
            cmsItemId,
            sectionTitle,
            fileImgHeader,
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
        updateSectionWithImage(
          sectionId,
          cmsItemId,
          sectionTitle,
          fileImgHeader,
          sectionType
        )
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

// Actualizar o crear una sección sin imagen
const updateSectionWithOutImage = async (
  sectionId,
  cmsItemId,
  sectionTitle,
  sectionType
) => {
  loadingBtnEditHeader.value = true;
  const updateMutation = PublicationMutations.setUpsertSectionWithoutImage({
    id: sectionId,
    cms_item_id: cmsItemId,
    section_title: sectionTitle,
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
  //console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, section } =
        dataMutation.upsertSection;

      if (status_code === 200 || status_code === 201) {
        await getDataAboutSection(section.id);
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
          updateSectionWithOutImage(
            sectionId,
            cmsItemId,
            sectionTitle,
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
        updateSectionWithOutImage(
          sectionId,
          cmsItemId,
          sectionTitle,
          sectionType
        )
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const validateDataForm = async () => {
  const { valid } = await formHeader.value.validate();

  if (!valid) {
    return;
  }

  // Validar que se ha cargado un archivo
  if (!uploadedFile.value) {
    //updateItemPage(2, setTitleHeader.value, "");
    await updateSectionWithOutImage(
      sectionId.value,
      cmsItemIdThis.value,
      setTitleHeader.value,
      sectionTypeThis.value
    );
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

  //updateItemPageWithImage(2, setTitleHeader.value, uploadedFile.value, "");

  await updateSectionWithImage(
    sectionId.value,
    cmsItemIdThis.value,
    setTitleHeader.value,
    uploadedFile.value,
    sectionTypeThis.value
  );
  return;
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

// Función que maneja el cambio de archivo
const onFileChangeEntryImg = (event) => {
  // Acceder a los archivos seleccionados desde el evento
  const files = event.target.files;

  // Verificar si hay archivos seleccionados
  if (files.length > 0) {
    uploadedFileEntryImg.value = files[0]; // Tomar el primer archivo
  } else {
    uploadedFileEntryImg.value = null;
  }

  // Verificar el archivo cargado
  //console.log("Archivo asignado:", uploadedFile.value);
};

// Eliminar imagen de el encabezado
const deleteimageHeader = async (sectionId) => {
  loadingBtnDeleteImage.value = true;
  const updateMutation = PublicationMutations.setDeleteImageSection(sectionId);

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
  //console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, section } =
        dataMutation.deleteSectionImageHeader;

      if (status_code === 200) {
        await getDataAboutSection(section.id);
        imagenBanner.value = null;
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
        await refreshTokenAndRetry(() => deleteimageHeader(sectionId));
      } else {
        handleError({
          code: 500,
          message: "Error inesperado al actualizar la sección",
        });
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(() => deleteimageHeader(sectionId));
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const executeDeleteImage = async () => {
  await deleteimageHeader(sectionId.value);
};

// Subir imagen al contenido
const upsertEntryFileImg = async (
  etryFileId,
  entryId,
  fileImgEntry,
  fileType,
  elementOrder
) => {
  loadingBtnUploadImg.value = true;
  const initialMutation = PublicationMutations.setUpsertFileEntry({
    id: etryFileId,
    entry_id: entryId,
    url_file: true,
    element_order: elementOrder,
    file_type: fileType,
  });

  //console.log("Query generado:", initialMutation);

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
        file_entry: null,
      },
    })
  );
  formData.append("map", JSON.stringify({ 1: ["variables.file_entry"] }));
  formData.append("1", fileImgEntry);

  const datos = await axios.post(graphqlServerUrl, formData, { headers });
  //console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, file_entry } =
        dataMutation.upsertFileEntry;

      if (status_code === 200 || status_code === 201) {
        await getDataAboutSection(sectionId.value);
        closeDialogUploadImg();
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() =>
          upsertEntryFileImg(
            etryFileId,
            entryId,
            fileImgEntry,
            fileType,
            elementOrder
          )
        );
      } else {
        handleError({
          code: 500,
          message: "Error inesperado al actualizar archivo",
        });
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(() =>
        upsertEntryFileImg(
          etryFileId,
          entryId,
          fileImgEntry,
          fileType,
          elementOrder
        )
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

// Actualizar o crear una sección sin imagen
const upsertEntry = async (sectionId, entryTitle, entryComplement) => {
  loadingBtnEntryContent.value = true;
  const updateMutation = PublicationMutations.setUpsertEntry({
    section_id: sectionId,
    entry_title: entryTitle,
    entry_complement: entryComplement,
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
  //console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, entry } = dataMutation.upsertEntry;

      if (status_code === 200 || status_code === 201) {
        entryContentSelected.value.entry_id = entry.id;
        return entry.id;
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() =>
          upsertEntry(sectionId, entryTitle, entryComplement)
        );
      } else {
        handleError({
          code: 500,
          message: "Error inesperado al actualizar o crear el enlace",
        });
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(() =>
        upsertEntry(sectionId, entryTitle, entryComplement)
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const upsertEntryContent = async (
  entryContentId,
  entryId,
  content,
  contentType,
  elementOrder
) => {
  loadingBtnEntryContent.value = true;
  const deleteMutation = PublicationMutations.setUpsertContentEntry({
    id: entryContentId,
    entry_id: entryId,
    content: content,
    content_type: contentType,
    element_order: elementOrder,
  });

  const token = localStorage.TokenCollaboratorCms;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  //console.log(deleteMutation);
  const datos = await axios.post(
    graphqlServerUrl,
    {
      query: deleteMutation,
    },
    { headers }
  );
  //console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, contentEntry } =
        dataMutation.upsertContentEntry;

      if (status_code === 200 || status_code === 201) {
        await getDataAboutSection(sectionId.value);
        closeDialogEntryContent();
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() =>
          upsertEntryContent(
            entryContentId,
            entryId,
            content,
            contentType,
            elementOrder
          )
        );
      } else {
        handleError({
          code: 500,
          message: "Error inesperado al actualizar contenido",
        });
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(() =>
        upsertEntryContent(
          entryContentId,
          entryId,
          content,
          contentType,
          elementOrder
        )
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const combineAndSortEntries = (entryes) => {
  return entryes.map((entry) => {
    // Combinar contentEntries y fileEntries en un solo array
    const combined = [...entry.contentEntries, ...entry.fileEntries];

    // Ordenar por element_order
    const sortedEntries = combined.sort(
      (a, b) => a.element_order - b.element_order
    );

    // Retornar el objeto de la entrada con el nuevo array ordenado
    return {
      ...entry,
      combinedEntries: sortedEntries,
    };
  });
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

const openDialogEntryContent = (item) => {
  //console.log("Elemento seleccionado:", item);
  entryContentSelected.value = item;

  switch (item.content_type) {
    case "h2":
      titleDialogEntryContent.value = "Editar Título";
      setTextEntryContent.value = item.content;
      labelEntryContent.value = "Título";
      isParagraph.value = false;
      break;
    case "p":
      titleDialogEntryContent.value = "Editar Párrafo";
      setTextEntryContent.value = item.content;
      labelEntryContent.value = "Párrafo";
      isParagraph.value = true;
      break;
    default:
      break;
  }
  visibleDialogEntryContent.value = true;
};

const validateDataFormEntryContent = async () => {
  const { valid } = await formEntryContent.value.validate();
  if (valid) {
    //console.log("Formulario válido");
    const entryContentId = entryContentSelected.value.id || null;
    let entryId = entryContentSelected.value.entry_id;
    const elementOrder = entryContentSelected.value.element_order;
    const contentType = entryContentSelected.value.content_type;

    if (entryId === null) {
      //console.log("entryId es null");
      entryId = await upsertEntry(sectionId.value, sectionTitle.value, ""); // Espera el ID generado

      if (!entryId) {
        console.error("No se pudo crear la entrada.");
        return; // Detiene la ejecución si no se creó correctamente
      }
    }
    await upsertEntryContent(
      entryContentId,
      entryId,
      setTextEntryContent.value,
      contentType,
      elementOrder
    );
  }
};

const validateDataFormEntryImg = async () => {
  // Validar que se ha cargado un archivo
  if (!uploadedFileEntryImg.value) {
    errorMessage.value = "No se ha cargado ningún archivo."; // Mensaje de error si no se cargó archivo
    return;
  }

  // Validar que el archivo sea una instancia de File
  if (!(uploadedFileEntryImg.value instanceof File)) {
    errorMessage.value = "El archivo seleccionado no es válido."; // Mensaje de error si no es un archivo válido
    return;
  }

  // Validar el formato del archivo (tipo MIME)
  if (!allowedFormats.includes(uploadedFileEntryImg.value.type)) {
    errorMessage.value = "Formato de imagen no válido. Use JPG, PNG o BMP."; // Mensaje de error si el formato no es válido
    return;
  }

  // Si pasa todas las validaciones, entonces se puede continuar
  //console.log("Archivo válido:", uploadedFileEntryImg.value);

  //console.log(entryFileSelected.value);
  const entryFileId = entryFileSelected.value.id || null;
  let entryId = entryFileSelected.value.entry_id;
  const elementOrder = entryFileSelected.value.element_order;

  if (entryId === null) {
    //console.log("entryId es null");
    entryId = await upsertEntry(sectionId.value, sectionTitle.value, ""); // Espera el ID generado

    if (!entryId) {
      console.error("No se pudo crear la entrada.");
      return; // Detiene la ejecución si no se creó correctamente
    }
  }

  await upsertEntryFileImg(
    entryFileId,
    entryId,
    uploadedFileEntryImg.value,
    "img",
    elementOrder
  );
};

// Función que maneja la eliminación de texto en el contenido de la entrada
const deleteEntryContent = async (entryContentId) => {
  loadingBtnDeleteContent.value = true;
  const deleteMutation =
    PublicationMutations.setDeleteContentEntry(entryContentId);

  const token = localStorage.TokenCollaboratorCms;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  //console.log(deleteMutation);
  const datos = await axios.post(
    graphqlServerUrl,
    {
      query: deleteMutation,
    },
    { headers }
  );
  //console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message } = dataMutation.deleteContentEntry;

      if (status_code === 200) {
        await getDataAboutSection(sectionId.value);
        closeDialogConfirmContent();
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() => deleteEntryContent(entryContentId));
      } else {
        handleError({
          code: 500,
          message: "Error inesperado al actualizar la sección",
        });
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(() => deleteEntryContent(entryContentId));
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

// Función que maneja la eliminación de un archivo en el contenido de la entrada
const deleteEntryFile = async (entryFileId) => {
  loadingBtnDeleteContent.value = true;
  const deleteMutation = PublicationMutations.setDeleteFileEntry(entryFileId);

  const token = localStorage.TokenCollaboratorCms;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  //console.log(deleteMutation);
  const datos = await axios.post(
    graphqlServerUrl,
    {
      query: deleteMutation,
    },
    { headers }
  );
  //console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message } = dataMutation.deleteFileEntry;

      if (status_code === 200) {
        await getDataAboutSection(sectionId.value);
        closeDialogConfirmContent();
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() => deleteEntryFile(entryFileId));
      } else {
        handleError({
          code: 500,
          message: "Error inesperado al actualizar la sección",
        });
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(() => deleteEntryFile(entryFileId));
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const executeDeleteContent = async () => {
  if (!deleteItemContent.value || !deleteItemContent.value.id) {
    console.warn("No hay un elemento válido para eliminar.");
    return;
  }

  try {
    if (deleteItemContent.value.file_type) {
      // Si tiene `file_type`, es un archivo y debe eliminarse con `deleteEntryFile`
      await deleteEntryFile(deleteItemContent.value.id);
    } else if (deleteItemContent.value.content_type) {
      // Si tiene `content_type`, es contenido de texto y se elimina con `deleteEntryContent`
      await deleteEntryContent(deleteItemContent.value.id);
    } else {
      console.warn("El elemento no tiene un tipo válido para eliminar.");
      return;
    }
    //console.log("Eliminación exitosa.");
  } catch (error) {
    console.error("Error al eliminar contenido:", error);
  }
};

const selectedEntries = computed(() => {
  if (!orderedEntries.value || orderedEntries.value.length === 0) {
    return []; // Si no hay datos, devolvemos un array vacío
  }

  return (
    orderedEntries.value[0]?.combinedEntries.map((entry) => ({
      ...entry,
      // Concatenar graphqlImagesUrl solo para imágenes y PDFs
      url_file:
        entry.file_type === "img" || entry.file_type === "pdf"
          ? `${graphqlImagesUrl}${entry.url_file}`
          : entry.url_file,
    })) || []
  );
});

const updateEntryFile = async (entryFileId, entryId, elementOrder) => {
  const deleteMutation = PublicationMutations.setUpsertFileEntry({
    id: entryFileId,
    entry_id: entryId,
    element_order: elementOrder,
  });

  const token = localStorage.TokenCollaboratorCms;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  //console.log(deleteMutation);
  const datos = await axios.post(
    graphqlServerUrl,
    {
      query: deleteMutation,
    },
    { headers }
  );
  //console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, file_entry } =
        dataMutation.upsertFileEntry;

      if (status_code === 200 || status_code === 201) {
        responseMove.value.operation = true;
        responseMove.value.message = status_message;
      } else {
        responseMove.value.operation = false;
        responseMove.value.message = status_message;
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() =>
          updateEntryFile(entryFileId, entryId, elementOrder)
        );
      } else {
        responseMove.value.operation = false;
        responseMove.value.message =
          "Error inesperado al actualizar la sección";
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(() =>
        updateEntryFile(entryFileId, entryId, elementOrder)
      );
    } else {
      responseMove.value.operation = false;
      responseMove.value.message = "Error inesperado en el servidor";
    }
  }
};

const updateEntryContent = async (entryContentId, entryId, elementOrder) => {
  const deleteMutation = PublicationMutations.setUpsertContentEntry({
    id: entryContentId,
    entry_id: entryId,
    element_order: elementOrder,
  });

  const token = localStorage.TokenCollaboratorCms;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  //console.log(deleteMutation);
  const datos = await axios.post(
    graphqlServerUrl,
    {
      query: deleteMutation,
    },
    { headers }
  );
  //console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, contentEntry } =
        dataMutation.upsertContentEntry;

      if (status_code === 200) {
        responseMove.value.operation = true;
        responseMove.value.message = status_message;
      } else {
        responseMove.value.operation = false;
        responseMove.value.message = status_message;
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() =>
          updateEntryContent(entryContentId, entryId, elementOrder)
        );
      } else {
        responseMove.value.operation = false;
        responseMove.value.message =
          "Error inesperado al actualizar la sección";
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(() =>
        updateEntryContent(entryContentId, entryId, elementOrder)
      );
    } else {
      responseMove.value.operation = false;
      responseMove.value.message = "Error inesperado en el servidor";
    }
  }
};

const openDialogEntryImgNew = () => {
  titleDialogUploadImg.value = "Cargar Imagen";
  visibleDialogUploadImg.value = true;

  // Obtener el último element_order
  const combinedEntries = orderedEntries.value[0]?.combinedEntries || [];

  let elementOrder = 0;

  if (combinedEntries.length === 0) {
    //console.log("No hay elementos en combinedEntries. Último element_order: 0");
    elementOrder = 1;
  } else {
    const lastElementOrder = Math.max(
      ...combinedEntries.map((entry) => entry.element_order)
    );
    //console.log("Último element_order:", lastElementOrder);
    elementOrder = lastElementOrder + 1;
  }

  entryFileSelected.value = {
    id: null,
    entry_id: idEntryActive.value,
    element_order: elementOrder,
  };
  //console.log(entryFileSelected.value);
};

const openDialogRequireContent = () => {
  //console.log("Contenido seleccionado:", radios.value);
  if (radios.value === "img") {
    openDialogEntryImgNew();
  }

  if (radios.value === "h2" || radios.value === "p") {
    openDialogEntryContentNew(radios.value);
  }
};

const openDialogEntryContentNew = (content_type) => {
  switch (content_type) {
    case "h2":
      titleDialogEntryContent.value = "Crear Título";
      labelEntryContent.value = "Título";
      isParagraph.value = false;
      break;
    case "p":
      titleDialogEntryContent.value = "Crear Párrafo";
      labelEntryContent.value = "Párrafo";
      isParagraph.value = true;
      break;
    default:
      break;
  }

  // Obtener el último element_order
  const combinedEntries = orderedEntries.value[0]?.combinedEntries || [];

  let elementOrder = 0;

  if (combinedEntries.length === 0) {
    //console.log("No hay elementos en combinedEntries. Último element_order: 0");
    elementOrder = 1;
  } else {
    const lastElementOrder = Math.max(
      ...combinedEntries.map((entry) => entry.element_order)
    );
    //console.log("Último element_order:", lastElementOrder);
    elementOrder = lastElementOrder + 1;
  }

  entryContentSelected.value = {
    id: null,
    entry_id: idEntryActive.value,
    content_type: content_type,
    element_order: elementOrder,
  };

  visibleDialogEntryContent.value = true;
};

const openDialogAddContent = () => {
  //console.log("Elementos ordenados:", orderedEntries.value[0]);
  if (orderedEntries.value[0] !== undefined) {
    idEntryActive.value = orderedEntries.value[0].id;
  } else {
    idEntryActive.value = null;
  }

  visibleDialogTypeContent.value = true;
};

const openDialogHeader = () => {
  setTitleHeader.value = sectionTitle.value;
  imgEdit.value = imagenBanner.value;
  titleDialogHeader.value = "Editar Cabecera";
  visibleDialogHeader.value = true;
};

const openDialogConfirmHeader = () => {
  visibleDialogConfirmHeader.value = true;
};

const openDialogEntryImg = (item) => {
  //console.log("Elemento seleccionado:", item);
  titleDialogUploadImg.value = "Editar Imagen";
  imgEditUpload.value = item.url_file;
  visibleDialogUploadImg.value = true;
  entryFileSelected.value = item;
};

const openDialogConfirmDelContent = (item) => {
  //console.log("Elemento seleccionado:", item);
  messageContent.value = "¿Desea eliminar el elemento del contenido?";
  visibleDialogConfirmContent.value = true;
  deleteItemContent.value = item;
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

const closeDialogTypeContent = () => {
  visibleDialogTypeContent.value = false;
  loadingBtnEntryContent.value = false;
  radios.value = "h2";
};

const closeDialogUploadImg = () => {
  visibleDialogUploadImg.value = false;
  errorMessage.value = "";
  uploadedFileEntryImg.value = null;
  loadingBtnUploadImg.value = false;
  closeDialogTypeContent();
};

const closeDialogEntryContent = () => {
  visibleDialogEntryContent.value = false;
  setTextEntryContent.value = "";
  loadingBtnEntryContent.value = false;
  titleDialogEntryContent.value = "";
  labelEntryContent.value = "";
  isParagraph.value = false;
  closeDialogTypeContent();
};

const closeDialogConfirmContent = () => {
  visibleDialogConfirmContent.value = false;
  loadingBtnDeleteContent.value = false;
};

const closeDialog = () => {
  closeDialogHeader();
  closeDialogConfirmHeader();
  closeDialogTypeContent();
  closeDialogUploadImg();
  closeDialogEntryContent();
  closeDialogConfirmContent();
  visibleError.value = false;
};

const moveUp = async (index) => {
  if (index > 0) {
    overlay.value = true;

    const combinedEntries = orderedEntries.value[0].combinedEntries;
    const itemToMove = combinedEntries[index];
    const itemSwapped = combinedEntries[index - 1];

    //console.log("Se mueve hacia arriba:", itemToMove);
    //console.log("Se intercambia con:", itemSwapped);
    // Intercambiar element_order
    const tempOrder = itemToMove.element_order;
    itemToMove.element_order = itemSwapped.element_order;
    itemSwapped.element_order = tempOrder;

    // Reordenar en el array
    combinedEntries.splice(index, 1);
    combinedEntries.splice(index - 1, 0, itemToMove);

    // Enviar las actualizaciones al backend
    if (itemToMove.file_type) {
      await updateEntryFile(
        itemToMove.id,
        itemToMove.entry_id,
        itemToMove.element_order
      );
    } else if (itemToMove.content_type) {
      await updateEntryContent(
        itemToMove.id,
        itemToMove.entry_id,
        itemToMove.element_order
      );
    }

    if (itemSwapped.file_type) {
      await updateEntryFile(
        itemSwapped.id,
        itemSwapped.entry_id,
        itemSwapped.element_order
      );
    } else if (itemSwapped.content_type) {
      await updateEntryContent(
        itemSwapped.id,
        itemSwapped.entry_id,
        itemSwapped.element_order
      );
    }

    if (responseMove.value.operation === true) {
      overlay.value = false;
    } else {
      overlay.value = false;
      handleError({
        code: 500,
        message: responseMove.value.message,
      });
    }
  }
};

const moveDown = async (index) => {
  if (index < orderedEntries.value[0].combinedEntries.length - 1) {
    overlay.value = true;

    const combinedEntries = orderedEntries.value[0].combinedEntries;
    const itemToMove = combinedEntries[index];
    const itemSwapped = combinedEntries[index + 1];

    //console.log("Se mueve hacia abajo:", itemToMove);
    //console.log("Se intercambia con:", itemSwapped);
    // Intercambiar element_order
    const tempOrder = itemToMove.element_order;
    itemToMove.element_order = itemSwapped.element_order;
    itemSwapped.element_order = tempOrder;

    // Reordenar en el array
    combinedEntries.splice(index, 1);
    combinedEntries.splice(index + 1, 0, itemToMove);

    // Enviar las actualizaciones al backend
    if (itemToMove.file_type) {
      await updateEntryFile(
        itemToMove.id,
        itemToMove.entry_id,
        itemToMove.element_order
      );
    } else if (itemToMove.content_type) {
      await updateEntryContent(
        itemToMove.id,
        itemToMove.entry_id,
        itemToMove.element_order
      );
    }

    if (itemSwapped.file_type) {
      await updateEntryFile(
        itemSwapped.id,
        itemSwapped.entry_id,
        itemSwapped.element_order
      );
    } else if (itemSwapped.content_type) {
      await updateEntryContent(
        itemSwapped.id,
        itemSwapped.entry_id,
        itemSwapped.element_order
      );
    }

    if (responseMove.value.operation === true) {
      overlay.value = false;
    } else {
      overlay.value = false;
      handleError({
        code: 500,
        message: responseMove.value.message,
      });
    }
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
    //console.log("EXISTE ", sectionId.value);
    await getDataAboutSection(sectionId.value);
    //await getDataAboutPage(2);
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

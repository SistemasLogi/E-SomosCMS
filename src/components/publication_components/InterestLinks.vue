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
            En esta sección, podrás editar los enlaces de interés, agregar
            nuevos y configurar las redes sociales o enlaces de contacto de cada
            uno. Pulsando en los iconos de redes sociales, puedes editarlos o
            eliminarlos. Para crear un nuevo enlace en una tarjeta, simplemente
            haz clic en el botón de 'Add link' en la tarjeta correspondiente.
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
                @click="
                  openDialogEditTarget(
                    link.idSection,
                    link.name,
                    link.image,
                    'Editar imagen o título'
                  )
                "
              ></v-btn>
              <v-btn
                icon="mdi-trash-can"
                color="error"
                variant="text"
                v-tooltip:top="'Eliminar tarjeta'"
                @click="openDialogDeleteTarget(link.idSection, link.name)"
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
              <v-avatar
                v-for="social in link.socials"
                :image="social.icon"
                size="40"
                style="cursor: pointer"                
                @click="openDialogLinkSocial(social)"
                v-tooltip:top="'Editar enlace '+ social.entryTitle"
              >
            </v-avatar>
            </v-card-subtitle>
            <v-card-actions>
              <v-btn
                append-icon="mdi-plus"
                class="text-none"
                color="primary"
                rounded="lg"
                text="Add Link"
                variant="flat"
                @click="openDialogLinks(link)"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4" lg="2">
          <v-card
            rounded="lg"
            class="add-card d-flex flex-column align-center text-center pa-4"
            @click="
              openDialogEditTarget(null, null, null, 'Agregar nueva tarjeta')
            "
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
                :rules="[rules.maxLengthRule(45)]"
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
                :rules="[rules.maxLengthRule(200)]"
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
          @click="validateDataFormTitle"
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
        <v-form ref="formTarget">
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
              :rules="[rules.maxLengthRule(25)]"
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
          @click="closeDialogTarget"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="lg"
          text="Guardar"
          variant="flat"
          :loading="loadingBtnEditTarget"
          @click="validateDataForm"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialogo de Editar Enlaces de redes sociales -->
  <v-dialog v-model="visibleDialogLinks" max-width="600" persistent>
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        {{ titleDialogLinks }}
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogLinks"
        ></v-btn>
      </v-card-title>

      <v-divider class="mb-4"></v-divider>

      <v-col cols="12" v-if="linksExist">
        <v-card>
          <v-card-title class="text-h6"> Enlace Actual </v-card-title>
          <v-card-subtitle class="d-flex justify-center align-center">
            <!-- Mostrar enlace de redes sociales -->
            <v-avatar :image="linkTargetSelected.icon" size="60"></v-avatar>
          </v-card-subtitle>
        </v-card>
      </v-col>

      <v-card-text>
        <v-form ref="formLinks">
          <v-col cols="12">
            <v-select
              v-model="selectedIcon"
              color="primary"
              base-color="primary"
              density="comfortable"
              variant="solo-filled"
              label="Tipos de Enlaces"
              :items="itemsIcons"
              item-title="title"
              item-value="value"
              clearable
              :rules="[rules.required]"
            >
            </v-select>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="setUrlLink"
              label="Url del Enlace"
              color="primary"
              base-color="primary"
              density="comfortable"
              variant="solo-filled"
              clearable
              :rules="[rules.required, rules.urlRule, rules.maxLengthRule(150)]"
            ></v-text-field>
          </v-col>
        </v-form>
        <v-col
          cols="12"
          class="d-flex justify-center align-center"
          v-if="linksExist"
        >
          <v-btn
            class="text-none"
            rounded="lg"
            text="Eliminar Enlace"
            variant="flat"
            color="danger"
            @click="openDialogConfirmDeleteLink"
          ></v-btn>
        </v-col>
      </v-card-text>

      <v-divider class="mt-2"></v-divider>

      <v-card-actions class="my-2 d-flex justify-end">
        <v-btn
          class="text-none"
          rounded="lg"
          text="Cancelar"
          @click="closeDialogLinks"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="lg"
          text="Guardar"
          variant="flat"
          :loading="loadingBtnEditLinks"
          @click="validateDataFormLinks"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialogo de Confirmar Eliminar Enlace de redes sociales -->
  <v-dialog v-model="visibleDialogConfirmLink" max-width="600px" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        Confirmar...
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogConfirmLink"
        ></v-btn>
      </v-card-title>
      <v-divider class="mt-3"></v-divider>
      <v-card-text
        ><v-alert :title="titleConfirmDeleteLink" type="warning" variant="tonal"
          ><p style="color: black">
            {{ textDialogConfirmDeleteLink }}
          </p></v-alert
        >
      </v-card-text>
      <v-divider class="mt-3"></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          color="primary"
          text
          @click="closeDialogConfirmLink"
          >No
        </v-btn>
        <v-btn
          color="primary"
          text="Si"
          variant="tonal"
          :loading="loadingBtnDeleteLink"
          @click="executeDeleteEntryLink"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialogo de Confirmar Eliminar Enlace de redes sociales -->
  <v-dialog v-model="visibleDialogConfirmTarget" max-width="600px" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        Confirmar...
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogConfirmTarget"
        ></v-btn>
      </v-card-title>
      <v-divider class="mt-3"></v-divider>
      <v-card-text
        ><v-alert
          :title="titleConfirmDeleteTarget"
          type="warning"
          variant="tonal"
          ><p style="color: black">
            {{ textDialogConfirmDeleteTarget }}
          </p></v-alert
        >
      </v-card-text>
      <v-divider class="mt-3"></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          color="primary"
          text
          @click="closeDialogConfirmTarget"
          >No
        </v-btn>
        <v-btn
          color="primary"
          text="Si"
          variant="tonal"
          :loading="loadingBtnDeleteTarget"
          @click="executeDeleteTarget"
        ></v-btn>
      </v-card-actions>
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

const visibleDialogTitle = ref(false);
const visibleDialogTarget = ref(false);
const visibleDialogLinks = ref(false);
const visibleDialogConfirmLink = ref(false);
const visibleDialogConfirmTarget = ref(false);
const titleDialogLinks = ref("");
const titleDialogTarget = ref("");
const setTitle = ref("");
const setDescription = ref("");
const setTitleTarget = ref("");
const setUrlLink = ref("");
const selectedIcon = ref(null);
const loadingBtnTitle = ref(false);
const loadingBtnEditTarget = ref(false);
const loadingData = ref(false);
const loadingBtnEditLinks = ref(false);
const loadingBtnDeleteLink = ref(false);
const loadingBtnDeleteTarget = ref(false);
const errorMessage = ref("");
const imgEdit = ref(null);
const codeError = ref("");
const visibleError = ref(false);
const textDialog = ref("");
const uploadedFile = ref(null);
const linksExist = ref(false);
const linkTargetSelected = ref({});
const itemsIcons = ref([]);
const titleConfirmDeleteLink = ref("");
const textDialogConfirmDeleteLink = ref("");
const titleConfirmDeleteTarget = ref("");
const textDialogConfirmDeleteTarget = ref("");
const allowedFormats = ["image/jpeg", "image/png", "image/bmp", "image/jpg"];
const dataSection = ref({
  title: "",
  description: "",
});
const links = ref([]);
const idSectionEdit = ref(null); // Variable para almacenar el ID de la sección a editar
const idSectionDelete = ref(null); // Variable para almacenar el ID de la sección a eliminar
const formRef = ref(null);
const formLinks = ref(null);
const formTarget = ref(null);
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

const getDataIcons = async () => {
  const initialQuery = PublicationPublicQueries.getIconsBootstrapList;
  try {
    const response = await axios.post(graphqlServerUrl, {
      query: initialQuery,
    });

    const { data } = response;

    if (data && data.data && data.data.getIconsBootstrap) {
      // Transformar la respuesta para el select
      itemsIcons.value = data.data.getIconsBootstrap.map((icon) => ({
        title: icon.icon_name, // Texto visible
        value: icon.icon_name, // Valor interno
      }));
    } else {
      handleError({
        code: "500",
        message: "Error al obtener los iconos",
      });
    }
  } catch (error) {
    console.error("Error: ", error);
  }
};

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

        const itemCms = cms_items[0];
        const sections = cms_items[0].sections || [];

        // Transformar los datos de sections en el formato de links
        links.value = sections.map((section) => ({
          idCms: itemCms.id,
          idSection: section.id,
          name: section.section_title,
          image:
            `${graphqlImagesUrl}${section.url_header_image}` ||
            "default-image.jpg", // Imagen por defecto si es null
          socials: section.entryes.map((entry) => ({
            icon: mapSocialIcon(entry.entry_title), // Convertir el título en icono
            entryId: entry.id,
            entryTitle: entry.entry_title,
            entryUrl: entry.entry_complement,
            sectionId: section.id,
            sectionName: section.section_title,
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

// Actualizar la sección de cabecera
const updateItemPage = async (itemId, itemTitle, textAdd) => {
  loadingBtnTitle.value = true;
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
        await getDataInterestLinks(8);
        loadingBtnTitle.value = false;
        closeDialogTitle();
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

const saveDataItem = async () => {
  await updateItemPage(8, setTitle.value, setDescription.value);
};

// Actualizar o crear una sección con imagen
const upsertSectionWithImage = async (
  sectionId,
  cmsItemId,
  sectionTitle,
  sectionType,
  fileImgHeader
) => {
  loadingBtnEditTarget.value = true;
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
        await getDataInterestLinks(8);
        closeDialogTarget();
        loadingBtnEditTarget.value = false;
        imgEdit.value = null;
        idSectionEdit.value = null;
        setTitleTarget.value = "";
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() =>
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
      await refreshTokenAndRetry(() =>
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

// Actualizar o crear una sección sin imagen
const upsertSectionWithOutImage = async (
  sectionId,
  cmsItemId,
  sectionTitle,
  sectionType
) => {
  loadingBtnEditTarget.value = true;
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
  console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, section } =
        dataMutation.upsertSection;

      if (status_code === 200) {
        await getDataInterestLinks(8);
        closeDialogTarget();
        loadingBtnEditTarget.value = false;
        idSectionEdit.value = null;
        setTitleTarget.value = "";
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
          sectionType
        )
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

// Actualizar o crear una sección sin imagen
const upsertEntry = async (entryId, sectionId, entryTitle, entryComplement) => {
  loadingBtnEditLinks.value = true;
  const updateMutation = PublicationMutations.setUpsertEntry({
    id: entryId,
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
  console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, entry } = dataMutation.upsertEntry;

      if (status_code === 200 || status_code === 201) {
        await getDataInterestLinks(8);
        closeDialogLinks();
        setUrlLink.value = "";
        selectedIcon.value = null;
        linkTargetSelected.value = {};
        loadingBtnEditLinks.value = false;
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() =>
          upsertEntry(entryId, sectionId, entryTitle, entryComplement)
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
        upsertEntry(entryId, sectionId, entryTitle, entryComplement)
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const deleteEntryData = async (entryId) => {
  loadingBtnDeleteLink.value = true;
  const deleteMutation = PublicationMutations.setDeleteEntry(entryId);

  const token = localStorage.TokenCollaboratorCms;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  console.log(deleteMutation);
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
      const { status_code, status_message } = dataMutation.deleteEntry;

      if (status_code === 200) {
        await getDataInterestLinks(8);
        closeDialogConfirmLink();
        closeDialogLinks();
        setUrlLink.value = "";
        selectedIcon.value = null;
        linkTargetSelected.value = {};
        loadingBtnDeleteLink.value = false;
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() => deleteEntryData(entryId));
      } else {
        handleError({
          code: 500,
          message: "Error inesperado al actualizar la sección",
        });
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(() => deleteEntryData(entryId));
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const executeDeleteEntryLink = async () => {
  await deleteEntryData(linkTargetSelected.value.entryId);
};

const deleteSection = async (sectionId) => {
  loadingBtnDeleteTarget.value = true;
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
        await getDataInterestLinks(8);
        closeDialogConfirmTarget();
        loadingBtnDeleteTarget.value = false;
        idSectionDelete.value = null;
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

const executeDeleteTarget = async () => {
  await deleteSection(idSectionDelete.value);
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
  // Validar que se ha cargado un archivo
  const { valid } = await formTarget.value.validate();

  if (!valid) {
    return;
  }

  if (!uploadedFile.value) {
    upsertSectionWithOutImage(
      idSectionEdit.value,
      8,
      setTitleTarget.value,
      "card"
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

  upsertSectionWithImage(
    idSectionEdit.value,
    8,
    setTitleTarget.value,
    "card",
    uploadedFile.value
  );
};

const validateDataFormTitle = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) {
    await saveDataItem();
  }
};

const validateDataFormLinks = async () => {
  const { valid } = await formLinks.value.validate();
  if (valid) {
    console.log("Formulario válido");

    if (linksExist.value) {
      console.log("edit");
      const entryId = linkTargetSelected.value.entryId;
      const sectionId = linkTargetSelected.value.sectionId;
      const entryTitle = selectedIcon.value;
      const entryComplement = setUrlLink.value;
      await upsertEntry(entryId, sectionId, entryTitle, entryComplement);
    } else {
      console.log("new");
      const entryId = null;
      const sectionId = linkTargetSelected.value.idSection;
      const entryTitle = selectedIcon.value;
      const entryComplement = setUrlLink.value;
      await upsertEntry(entryId, sectionId, entryTitle, entryComplement);
    }
  }
};

const handleError = (response) => {
  codeError.value = `Error: ${response.code}`;
  textDialog.value = response.message;
  visibleError.value = true;
};

const openDialogEditSection = () => {
  visibleDialogTitle.value = true;
  setTitle.value = dataSection.value.title;
  setDescription.value = dataSection.value.description;
};

const closeDialog = () => {
  closeDialogTitle();
  closeDialogTarget();
  closeDialogLinks();
  closeDialogConfirmLink();
  closeDialogConfirmTarget();
  visibleError.value = false;
};

const closeDialogTitle = () => {
  visibleDialogTitle.value = false;
  loadingBtnTitle.value = false;
};

const openDialogEditTarget = (idSection, name, image, title) => {
  visibleDialogTarget.value = true;
  setTitleTarget.value = name;
  imgEdit.value = image;
  titleDialogTarget.value = title;
  idSectionEdit.value = idSection;
};

const closeDialogTarget = () => {
  visibleDialogTarget.value = false;
  uploadedFile.value = null;
  errorMessage.value = "";
  loadingBtnEditTarget.value = false;
};

const openDialogLinks = (link) => {
  linksExist.value = false;
  linkTargetSelected.value = {};
  visibleDialogLinks.value = true;
  //linksSelected.value = link;
  titleDialogLinks.value = "Agregar link en " + link.name;
  linkTargetSelected.value = link;
  console.log(link);
};

const openDialogLinkSocial = (social) => {
  linksExist.value = true;
  linkTargetSelected.value = {};
  visibleDialogLinks.value = true;
  //linksSelected.value = link;
  titleDialogLinks.value =
    "Editar link de " + social.entryTitle + " en " + social.sectionName;
  linkTargetSelected.value = social;
  setUrlLink.value = social.entryUrl;
  // Asignar el valor al select (entryTitle coincide con icon_name)
  selectedIcon.value = social.entryTitle;
  console.log(social);
};

const openDialogConfirmDeleteLink = () => {
  titleConfirmDeleteLink.value =
    "Eliminar enlace " + linkTargetSelected.value.entryTitle;
  textDialogConfirmDeleteLink.value =
    "¿Estás seguro de eliminar el enlace de " +
    linkTargetSelected.value.entryTitle +
    " en " +
    linkTargetSelected.value.sectionName +
    "?";
  visibleDialogConfirmLink.value = true;
};

const openDialogDeleteTarget = (idSection, name) => {
  visibleDialogConfirmTarget.value = true;
  titleConfirmDeleteTarget.value = "Eliminar tarjeta " + name;
  textDialogConfirmDeleteTarget.value =
    "¿Estás seguro de eliminar la tarjeta " + name + "?";
  idSectionDelete.value = idSection;
};

const closeDialogLinks = () => {
  visibleDialogLinks.value = false;
  setUrlLink.value = "";
  selectedIcon.value = null;
  loadingBtnEditLinks.value = false;
};

const closeDialogConfirmLink = () => {
  visibleDialogConfirmLink.value = false;
  loadingBtnDeleteLink.value = false;
};

const closeDialogConfirmTarget = () => {
  visibleDialogConfirmTarget.value = false;
  loadingBtnDeleteTarget.value = false;
};

const editEntry = (social) => {
  console.log(social);
  setUrlLink.value = social.entryUrl;
};

onMounted(async () => {
  const tokenExists = checkLocalStorageData("TokenCollaboratorCms");

  // Lógica basada en si el token existe o no
  if (tokenExists) {
    //console.log("EXISTE");
    await getDataInterestLinks(8);
    await getDataIcons();
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

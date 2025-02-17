<template>
  <v-container class="fill-height" v-if="!initial">
    <v-responsive class="align-center text-center fill-height">
      <v-img height="250" src="@/assets/logo.gif" />
      <v-empty-state
        headline="!Bienvenido!"
        title="Sistema integrado CMS"
        text="Cargando sistema de administración..."
      ></v-empty-state>
    </v-responsive>
  </v-container>
  <div v-else>
    <v-card>
      <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        permanent
        :width="280"
        @click="rail = false"
      >
        <v-list-item
          prepend-avatar="@/assets/avatar.png"
          :title="userActiveName"
          nav
          color="primary"
        >
          <template v-slot:append>
            <v-btn
              variant="text"
              icon="mdi-chevron-left"
              @click.stop="toggleRailStop"
            ></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list
          density="compact"
          nav
          color="primary"
          v-model:opened="openGroups"
        >
          <!-- Renderizado del menú -->
          <template v-for="item in filteredMenuItems">
            <v-list-group
              v-if="item.children && item.children.length > 0"
              :key="item.title"
              v-model="expandedGroups[item.title]"
            >
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  :prepend-icon="item.icon"
                  :title="item.title"
                  @click="toggleRail"
                ></v-list-item>
              </template>
              <v-list-item
                v-for="child in item.children"
                :key="child.title"
                :value="child.title"
                :title="child.title"
                :prepend-icon="child.icon"
                :to="child.route || null"
                @click="toggleRail"
              ></v-list-item>
            </v-list-group>
            <v-list-item
              v-else
              :key="item.title + '-item'"
              v-model="selectedGroup"
              :value="item.title"
              :title="item.title"
              :prepend-icon="item.icon"
              :to="item.route || null"
              @click="toggleRail"
            ></v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer>
    </v-card>

    <!-- Barra de navegación superior -->
    <v-app-bar class="px-3" color="grey-lighten-4" app>
      <v-app-bar-title><b>e-somos *{{ rolUser }}*</b></v-app-bar-title>
      <v-spacer></v-spacer>

      <v-layout style="height: 56px">
        <v-bottom-navigation
          v-model="valueModel"
          color="primary"
          bg-color="grey-lighten-4"
          grow
        >
          
          <v-btn @click="logout">
            <v-icon>mdi-logout</v-icon>

            Cerrar Sesión
          </v-btn>
        </v-bottom-navigation>
      </v-layout>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </div>
  <v-dialog v-model="visible" persistent max-width="500px">
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
import { useRouter, useRoute } from "vue-router";
import { ref, computed, watch, onMounted } from "vue";
import {
  menuItems,
  checkLocalStorageData,
  getTokenRefreshKeyCollaborator,
} from "@/graphql/utils";
import { UserCollaboratorQueries } from "@/graphql/queries/user_queries";
import { graphqlServerUrl, graphqlImagesUrl } from "@/graphql/config";

const drawer = ref(true);
const rail = ref(true);
const selectedGroup = ref(null);
const valueModel = ref("");
const initial = ref(false);
const userActiveName = ref("");
const rolUser = ref("");
const visible = ref(false);
const textDialog = ref("");
const codeError = ref("");
const expandedGroups = ref({});
const openGroups = ref([]);

const router = useRouter();
const route = useRoute();
const storedPermissions = localStorage.getItem("AccessCollaboratorCms");

// Simula los permisos del usuario (en la práctica, obtén esto del token)
const userPermissions = ref(
  storedPermissions ? JSON.parse(storedPermissions) : []
);

const dataUserCollaborator = async () => {
  try {
    const initialQuery = UserCollaboratorQueries.getCollaboratorUserByToken;
    const token = localStorage.TokenCollaboratorCms;
    const headers = {
      Authorization: `Bearer ${token}`, // Agrega el token como un encabezado de autorización
    };

    const datos = await axios.post(
      graphqlServerUrl,
      {
        query: initialQuery,
      },
      { headers }
    );
    console.log(datos);
    const errors = [];
    try {
      if (datos.data && datos.data.data) {
        const dataQuery = datos.data.data;

        if (dataQuery.collaboratorUserByToken) {
          const { status_code, status_message, collaborator_user } =
            dataQuery.collaboratorUserByToken;

          if (status_code === 200) {
            userActiveName.value = collaborator_user.collaborator_name;
            rolUser.value = collaborator_user.roles.rol_name;
            initial.value = true;
          } else {
            //console.log(status_message);
            errors.push({ code: status_code, message: status_message });
          }
        } else {
          handleError({
            code: 500,
            message: "Error obteniendo los datos del usuario",
          });
        }
      } else {
        //console.log(datos.data.errors[0].extensions.debugMessage);
        if (
          datos.data.errors[0].extensions.debugMessage == "Token has expired"
        ) {
          await refreshTokenAndRetry(() => dataUserCollaborator());
        } else {
          handleError({ code: 500, message: "Unexpected error" });
        }
      }
    } catch (error) {
      console.log(datos.data.errors[0].extensions.debugMessage);
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() => dataUserCollaborator());
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
};

const handleError = (response) => {
  codeError.value = `Error: ${response.code}`;
  textDialog.value = response.message;
  visible.value = true;
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
    visible.value = true;
  }
};

const closeDialog = () => {
  visible.value = false;
};

watch(
  () => localStorage.getItem("AccessCollaboratorCms"),
  (newValue) => {
    userPermissions.value = newValue ? JSON.parse(newValue) : [];
  }
);

// Filtra las entradas del menú según los permisos del usuario y la propiedad alwaysVisible
const filteredMenuItems = computed(() => {
  return menuItems.filter((item) => {
    const hasPermission = userPermissions.value.includes(item.permission);
    const alwaysVisible = item.permission === 0;

    if (item.children) {
      const filteredChildren = item.children.filter(
        (child) =>
          userPermissions.value.includes(child.permission) ||
          child.permission === 0
      );

      if (filteredChildren.length > 0) {
        item.children = filteredChildren; // Actualizar children
        return true;
      } else {
        return false; // Si no hay hijos visibles, descartar este elemento
      }
    }

    return hasPermission || alwaysVisible;
  });
});

// Función para cambiar el estado de 'rail'
const toggleRail = () => {
  rail.value = false;
};

// Función para cerrar todos los grupos
const closeAllGroups = () => {
  openGroups.value = [];
};

const toggleRailStop = () => {
  rail.value = !rail.value;
  closeAllGroups();
};

const logout = () => {
  localStorage.removeItem("TokenCollaboratorCms");
  localStorage.removeItem("EncryptedKeyCollaboratorCms");
  localStorage.removeItem("AccessCollaboratorCms");
  router.push("/");
};

onMounted(async () => {
  const tokenExists = checkLocalStorageData("TokenCollaboratorCms");

  // Lógica basada en si el token existe o no
  if (tokenExists) {
    console.log("EXISTE");
    await dataUserCollaborator();
  } else {
    router.push("/");
  }
});
</script>
<style scoped>
.avatar-image {
  object-fit: cover;
  width: 100%;
  height: 40%;
}
</style>

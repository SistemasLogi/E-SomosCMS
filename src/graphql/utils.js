import axios from "axios";
import { graphqlServerUrl } from "@/graphql/config";
import { UserAuthQueries } from "@/graphql/queries/auth_queries";

export function checkLocalStorageData(key) {
  const data = localStorage.getItem(key);
  return data !== null;
}

export async function getTokenRefreshKeyCollaborator(enciptedKey) {
  const initialQuery = UserAuthQueries.getRefreshToken(enciptedKey);
  try {
    const datosRefresh = await axios.post(graphqlServerUrl, {
      query: initialQuery,
    });

    const { data } = datosRefresh;

    if (data && data.data) {
      const dataQuery = data.data;
      const { status_code, status_message, accessToken, permissions } =
        dataQuery.refreshTokenCollaborator;

      if (status_code === 200) {
        localStorage.setItem("TokenCollaboratorCms", accessToken);
        localStorage.setItem(
          "AccessCollaboratorCms",
          JSON.stringify(permissions)
        );

        return { code: status_code, message: status_message };
      } else {
        return { code: status_code, message: status_message };
      }
    } else {
      console.log(datosRefresh);
      return { code: 500, message: "Unexpected error on server" };
    }
  } catch (error) {
    return { code: 500, message: error.message };
  }
}

export const decodeJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT ID token: ", error);
    return null;
  }
};

//{ title: "Dashboard", icon: "mdi-view-dashboard-variant", permission: 0, route: { name: "CustomerDashboard" }},//
export const menuItems = [
  {
    title: "Publicaciones",
    icon: "mdi-publish",
    permission: 1,
    children: [
      {
        title: "Munú Superior",
        icon: "mdi-page-layout-header",
        permission: 2,
        route: { name: "MenuSuperior" },
      },
      {
        title: "Slider Principal",
        icon: "mdi-view-carousel",
        permission: 3,
        route: { name: "PrincipalSlider" },
      },
      {
        title: "Enlaces de Interés",
        icon: "mdi-link-plus",
        permission: 4,
        route: { name: "EnlacesInteres" },
      },
      {
        title: "Pagina de Nosotros",
        icon: "mdi-information-variant",
        permission: 5,
        route: { name: "AboutUs" },
      },
      {
        title: "Pagina de Rutas",
        icon: "mdi-routes",
        permission: 6,
        route: { name: "RoutesOp" },
      },
      {
        title: "Pagina de Noticias",
        icon: "mdi-newspaper",
        permission: 7,
        route: { name: "NewsOp" },
      },
      {
        title: "Pagina de Trabaja Con Nosotros",
        icon: "mdi-account-hard-hat",
        permission: 8,
      },
      {
        title: "Pie de Pagina",
        icon: "mdi-page-layout-footer",
        permission: 9,
      },
    ],
  },
  {
    title: "Administración Usuarios",
    icon: "mdi-account-cog",
    permission: 10,
  },
];

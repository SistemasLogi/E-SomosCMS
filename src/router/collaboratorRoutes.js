export default [
  {
    path: "/colaboradores",
    name: "AplicationMain",
    component: () => import("@/components/MainAplication.vue"),
    children: [
      {
        path: "",
        name: "DashboardInitial",
        component: () =>
          import("@/components/general_components/Dashboard.vue"),
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: () =>
          import("@/components/general_components/Dashboard.vue"),
      },
      {
        path: "top-menu",
        name: "MenuSuperior",
        component: () =>
          import("@/components/publication_components/TopMenu.vue"),
      },
      {
        path: "slider-principal",
        name: "PrincipalSlider",
        component: () =>
          import("@/components/publication_components/SliderPrincipal.vue"),
      },
      {
        path: "enlaces-interes",
        name: "EnlacesInteres",
        component: () =>
          import("@/components/publication_components/InterestLinks.vue"),
      },
      {
        path: "pagina-nosotros",
        name: "AboutUs",
        component: () =>
          import("@/components/publication_components/About.vue"),
      },
      {
        path: "nosotros-entrada/:id/nombre/:title",
        name: "EntryAbout",
        component: () =>
          import(
            "@/components/publication_components/about_folder/AboutEntry.vue"
          ),
      },
      {
        path: "pagina-rutas",
        name: "RoutesOp",
        component: () =>
          import(
            "@/components/publication_components/RoutesOperation.vue"
          ),
      },
      {
        path: "rutas-entrada/:id/nombre/:title",
        name: "EntryRoute",
        component: () =>
          import(
            "@/components/publication_components/routes_folder/RouteEntry.vue"
          ),
      },
      {
        path: "pagina-noticias",
        name: "NewsOp",
        component: () =>
          import(
            "@/components/publication_components/News.vue"
          ),
      },
      {
        path: "noticias-entrada/:id/nombre/:title",
        name: "EntryNews",
        component: () =>
          import(
            "@/components/publication_components/news_folder/NewEntry.vue"
          ),
      },
      {
        path: "pagina-trabaja-con-nosotros",
        name: "WorkOp",
        component: () =>
          import(
            "@/components/publication_components/WorkWithUs.vue"
          ),
      },
    ],
  },
];

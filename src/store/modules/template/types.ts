export interface TemplateState {
  routeId:string;
  title: string;
  icon: JSX.Element;
  pageImage: string | undefined;
  drawerOpen: boolean;
  breadcrumbRoutes: BreadcrumbRoute[];
}

export interface BreadcrumbRoute {
  routeId:string;
  title: string;
  path: string;
}

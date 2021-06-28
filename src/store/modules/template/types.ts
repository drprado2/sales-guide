export interface TemplateState {
  routeId:string;
  title: string;
  icon: JSX.Element;
  pageImage: string | undefined;
  drawerOpen: boolean;
  dashboardsMinDate: Date;
  dashboardsMaxDate: Date;
  dashboardsDatesFilter: Date[];
  breadcrumbRoutes: Array<BreadcrumbRoute>;
}

export interface BreadcrumbRoute {
  routeId:string;
  title: string;
  path: string;
}

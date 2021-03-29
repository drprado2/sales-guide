import React, { useEffect } from 'react';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'primereact/card';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { Skeleton } from 'primereact/skeleton';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { format } from 'date-fns';
import { generatePath } from 'react-router';
import { Zoom } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { allRoutes } from '../../store/modules/auth/slice';
import { resetBreadcrumbTo, setCurrentPage } from '../../store/modules/template/slice';
import { getCompanyRequest } from '../../store/modules/company/slice';
import { StoreState } from '../../store';

const ViewCompanyPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const { loadingGetCompany, company } = useSelector((state: StoreState) => state.company);

  const { id } = useParams<{id: string}>();
  const params = useParams();

  useEffect(() => {
    dispatch(getCompanyRequest());
  }, [id]);

  const currentRoute = allRoutes.find((r) => r.id === 'view-company');
  const editCompanyRoute = allRoutes.find((r) => r.id === 'edit-company');

  const onEditCompany = () => {
    console.log('VEJA O ID DA PAGINA DE VIEW', id, location, params);
    history.push(generatePath(editCompanyRoute?.path ?? '/', { id }));
  };

  const pageTitle = company?.name ? company?.name : currentRoute?.title ?? '';

  useEffect(() => {
    if (currentRoute) {
      dispatch(setCurrentPage({
        icon: currentRoute.icon,
        routeId: currentRoute.id,
        title: pageTitle,
        pageImage: currentRoute.pageImage,
      }));
      dispatch(resetBreadcrumbTo({
        path: location.pathname,
        routeId: currentRoute.id,
        title: pageTitle,
      }));
    }
  }, [currentRoute, company]);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Visualizar a empresa" />
      </Helmet>
      <Zoom in>
        <div id="view-company-page" className="p-grid p-align-center">
          <Card className="p-col-12 p-xl-10" style={{ position: 'relative' }}>
            {loadingGetCompany && (
              <>
                <Skeleton className="p-skeleton-loader" />
                <ProgressSpinner className="loader-app" />
              </>
            )}
            <div className="p-grid">
              <div className="p-col-fixed" style={{ width: '220px', display: 'flex', flexDirection: 'column' }}>
                <img className="image-area p-shadow-3" src={company.logo} alt="Logomarca" />
                <div style={{ flexGrow: 1 }} />
                <Button label="Editar" icon="pi pi-user-edit" iconPos="right" onClick={onEditCompany} />
              </div>
              <div className="p-col p-grid">
                <div className="p-col-6">
                  <div className="label">Nome:</div>
                  <div className="label-value">{company.name}</div>
                </div>
                <div className="p-col-6">
                  <div className="label">Quantidade colaboradores:</div>
                  <div className="label-value">{company.totalColaborators}</div>
                </div>
                <div className="p-col-6">
                  <div className="label">Cor Primária:</div>
                  <div className="label-color-value p-shadow-3" style={{ backgroundColor: company.primaryColor }} />
                </div>
                <div className="p-col-6">
                  <div className="label">Cor da fonte primária:</div>
                  <div className="label-color-value p-shadow-3" style={{ backgroundColor: company.primaryFontColor }} />
                </div>
                <div className="p-col-6">
                  <div className="label">Cor Secundária:</div>
                  <div className="label-color-value p-shadow-3" style={{ backgroundColor: company.secondaryColor }} />
                </div>
                <div className="p-col-6">
                  <div className="label">Cor da fonte secundária:</div>
                  <div className="label-color-value p-shadow-3" style={{ backgroundColor: company.secondaryFontColor }} />
                </div>
                <Divider align="center">
                  <div className="p-d-inline-flex p-ai-center">
                    <i className="pi pi-desktop p-mr-2" />
                    <b>Dados da Plataforma</b>
                  </div>
                </Divider>
                <div className="p-col-6">
                  <div className="label">Data de Criação:</div>
                  <div className="label-value">{company.createdAt ? format(company.createdAt, 'dd/MM/yyyy') : ''}</div>
                </div>
                <div className="p-col-6">
                  <div className="label">Última Atualização:</div>
                  <div className="label-value">{company.updatedAt ? format(company.updatedAt, 'dd/MM/yyyy') : ''}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Zoom>
    </>
  );
};

export default ViewCompanyPage;

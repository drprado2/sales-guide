import React, { useEffect, useRef } from 'react';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'primereact/card';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { Skeleton } from 'primereact/skeleton';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Divider } from 'primereact/divider';
import { format } from 'date-fns';
import { generatePath } from 'react-router';
import { Zoom } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { allRoutes } from '../../../store/modules/auth/slice';
import { pushBreadcrumb, setCurrentPage } from '../../../store/modules/template/slice';
import {
  deleteRequest, getById, resetUpdateForm, resetViewData,
} from '../../../store/modules/zones/slice';
import { StoreState } from '../../../store';

const ViewZonePage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const toast = useRef<Toast>(null);

  const { loadingGetById, viewData, loadingDelete } = useSelector((state: StoreState) => state.zones);

  const { id } = useParams<{id: string}>();

  useEffect(() => {
    if ((!id || id === ':id')) {
      goToList();
    }
    if (id) {
      dispatch(getById(id));
    }
  }, [id]);

  useEffect(() => () => {
    dispatch(resetViewData());
  }, []);

  const currentRoute = allRoutes.find((r) => r.id === 'view-zone');
  const editRoute = allRoutes.find((r) => r.id === 'edit-zone');
  const listRoute = allRoutes.find((r) => r.id === 'zone-list');

  const onEdit = () => {
    console.log('passando aq', id);
    history.push(generatePath(editRoute?.path ?? '/', { id }));
  };

  const goToList = () => {
    history.push(listRoute?.path ?? '/');
  };

  const pageTitle = viewData?.name ? `Região ${viewData?.name}` : currentRoute?.title ?? '';

  useEffect(() => {
    if (currentRoute) {
      dispatch(setCurrentPage({
        icon: currentRoute.icon,
        routeId: currentRoute.id,
        title: pageTitle,
        pageImage: currentRoute.pageImage,
      }));
      dispatch(pushBreadcrumb({
        path: location.pathname,
        routeId: currentRoute.id,
        title: pageTitle,
      }));
    }
  }, [currentRoute, viewData]);

  useEffect(() => {
    if ((!id || id === ':id')) {
      goToList();
    }
  }, [id]);

  const onDeleteSuccess = () => {
    toast.current?.show({
      severity: 'success', summary: 'Deletado!', detail: 'Registro removido com sucesso!', life: 1500,
    });
    setTimeout(goToList, 1500);
  };

  const confirmDelete = () => {
    confirmDialog({
      message: 'Deseja realmente deletar esse registro?',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      // @ts-ignore
      header: 'Confirmar deleção',
      accept: () => dispatch(deleteRequest({ id, callBack: onDeleteSuccess })),
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Visualizar uma região" />
      </Helmet>
      <Zoom in>
        <div id="view-zone-page" className="p-grid p-align-center">
          <Card className="p-col-12 p-xl-10" style={{ position: 'relative' }}>
            {(loadingGetById || loadingDelete) && (
              <>
                <Skeleton className="p-skeleton-loader" />
                <ProgressSpinner className="loader-app" />
              </>
            )}
            <div className="header-area">
              <Button
                label="Deletar"
                className="p-button-danger"
                type="button"
                icon="pi pi-trash"
                onClick={confirmDelete}
              />
              <Button
                label="Editar"
                type="button"
                icon="pi pi-pencil"
                onClick={onEdit}
              />
            </div>
            <Divider />
            <div className="p-grid">
              <div className="p-col p-grid">
                <div className="p-col-6">
                  <div className="label">Nome:</div>
                  <div className="label-value">{viewData.name}</div>
                </div>
                <div className="p-col-6">
                  <div className="label">Empresa:</div>
                  <div className="label-value">{viewData.companyName}</div>
                </div>
                <div className="p-col-12">
                  <div className="label">Descrição:</div>
                  <div className="label-value">{viewData.description}</div>
                </div>
                <div className="p-col-4">
                  <div className="label">Vendedores na região:</div>
                  <div className="label-value">{viewData.totalSellers}</div>
                </div>
                <div className="p-col-4">
                  <div className="label">Provas enviadas na região:</div>
                  <div className="label-value">{viewData.totalProvesSent}</div>
                </div>
                <div className="p-col-4">
                  <div className="label">Treinamentos concluídos na região:</div>
                  <div className="label-value">{viewData.totalTreinamentDones}</div>
                </div>
                <div className="p-col-6">
                  <div className="label">Data de Criação:</div>
                  <div className="label-value">{viewData.createdAt ? format(new Date(viewData.createdAt), 'dd/MM/yyyy') : ''}</div>
                </div>
                <div className="p-col-6">
                  <div className="label">Última Atualização:</div>
                  <div className="label-value">{viewData.updatedAt ? format(new Date(viewData.updatedAt), 'dd/MM/yyyy') : ''}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Zoom>
    </>
  );
};

export default ViewZonePage;

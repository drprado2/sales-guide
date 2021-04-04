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
import { getUserRequest } from '../../store/modules/user-profile/slice';
import { StoreState } from '../../store';

const ViewUserProfilePage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const { loadingGetProfile, user } = useSelector((state: StoreState) => state.userProfile);

  const { id } = useParams<{id: string}>();

  useEffect(() => {
    dispatch(getUserRequest());
  }, [id]);

  const currentRoute = allRoutes.find((r) => r.id === 'view-user-profile');
  const editUserProfileRoute = allRoutes.find((r) => r.id === 'edit-user-profile');

  const onEditUser = () => {
    history.push(generatePath(editUserProfileRoute?.path ?? '/', { id }));
  };

  const pageTitle = user?.name ? user?.name : currentRoute?.title ?? '';

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
  }, [currentRoute, user]);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Visualizar o perfil do usuário" />
      </Helmet>
      <Zoom in>
        <div id="view-user-profile-page" className="p-grid p-align-center">
          <Card className="p-col-12 p-xl-10" style={{ position: 'relative' }}>
            {loadingGetProfile && (
              <>
                <Skeleton className="p-skeleton-loader" />
                <ProgressSpinner className="loader-app" />
              </>
            )}
            <div className="p-grid">
              <div className="p-col-fixed" style={{ width: '220px', display: 'flex', flexDirection: 'column' }}>
                <div className="image-area p-shadow-3" style={{ backgroundImage: `url(${user.avatarImage})` }} />
                <div style={{ flexGrow: 1 }} />
                <Button label="Editar" icon="pi pi-user-edit" iconPos="right" onClick={onEditUser} />
              </div>
              <div className="p-col p-grid">
                <div className="p-col-6">
                  <div className="label">Nome:</div>
                  <div className="label-value">{user.name}</div>
                </div>
                <div className="p-col-6">
                  <div className="label">Empresa:</div>
                  <div className="label-value">{user.companyName}</div>
                </div>
                <div className="p-col-6">
                  <div className="label">Email:</div>
                  <div className="label-value">{user.email}</div>
                </div>
                <div className="p-col-6">
                  <div className="label">Telefone:</div>
                  <div className="label-value">{user.phone}</div>
                </div>
                <div className="p-col-6">
                  <div className="label">Data de Nascimento:</div>
                  <div className="label-value">{user.birthDate ? format(user.birthDate, 'dd/MM/yyyy') : ''}</div>
                </div>
                <Divider align="center">
                  <div className="p-d-inline-flex p-ai-center">
                    <i className="pi pi-desktop p-mr-2" />
                    <b>Dados da Plataforma</b>
                  </div>
                </Divider>
                <div className="p-col-4">
                  <div className="label">Último acesso:</div>
                  <div className="label-value">{user.lastAccess ? format(user.lastAccess, 'dd/MM/yyyy') : ''}</div>
                </div>
                <div className="p-col-4">
                  <div className="label">Data de Criação:</div>
                  <div className="label-value">{user.createdAt ? format(user.createdAt, 'dd/MM/yyyy') : ''}</div>
                </div>
                <div className="p-col-4">
                  <div className="label">Última Atualização:</div>
                  <div className="label-value">{user.updatedAt ? format(user.updatedAt, 'dd/MM/yyyy') : ''}</div>
                </div>
                <div className="p-col-4">
                  <div className="label">Registros Criados:</div>
                  <div className="label-value">{user.recordCreationCount}</div>
                </div>
                <div className="p-col-4">
                  <div className="label">Registros Editados:</div>
                  <div className="label-value">{user.recordEditingCount}</div>
                </div>
                <div className="p-col-4">
                  <div className="label">Registros Removidos:</div>
                  <div className="label-value">{user.recordDeletionCount}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Zoom>
    </>
  );
};

export default ViewUserProfilePage;

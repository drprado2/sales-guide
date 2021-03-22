import React, { useEffect } from 'react';
import './styles.scss';
import { useDispatch } from 'react-redux';
import { Card } from 'primereact/card';
import { allRoutes } from '../../store/modules/auth/slice';
import { resetBreadcrumbTo, setCurrentPage } from '../../store/modules/template/slice';

const UserProfilePage = () => {
  const dispatch = useDispatch();

  const currentRoute = allRoutes.find((r) => r.id === 'user-profile');

  useEffect(() => {
    if (currentRoute) {
      dispatch(setCurrentPage({
        icon: currentRoute.icon,
        routeId: currentRoute.id,
        title: currentRoute.title,
        pageImage: currentRoute.pageImage,
      }));
      dispatch(resetBreadcrumbTo({
        path: currentRoute.path,
        routeId: currentRoute.id,
        title: currentRoute.title,
      }));
    }
  }, [currentRoute]);

  return (
    <div id="user-profile-page">
      <Card title="Perfil">
        <div>Página aqui</div>
      </Card>
    </div>
  );
};

export default UserProfilePage;

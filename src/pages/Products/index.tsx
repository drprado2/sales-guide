import React, { useEffect } from 'react';
import './styles.scss';
import { useDispatch } from 'react-redux';
import { Card } from 'primereact/card';
import { allRoutes } from '../../store/modules/auth/slice';
import { resetBreadcrumbTo, setCurrentPage } from '../../store/modules/template/slice';

const ProductsPage = () => {
  const dispatch = useDispatch();

  const currentRoute = allRoutes.find((r) => r.id === 'products');

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
    <div id="products-page">
      <Card title="Produtos">
        <div>Página aqui</div>
      </Card>
    </div>
  );
};

export default ProductsPage;

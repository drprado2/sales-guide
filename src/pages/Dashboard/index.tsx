import React, { useEffect, useState } from 'react';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'primereact/card';
import { Helmet } from 'react-helmet';
import { allRoutes, signOutRequest } from '../../store/modules/auth/slice';
import { resetBreadcrumbTo, setCurrentPage } from '../../store/modules/template/slice';
import { StoreState } from '../../store';
import DashboardCard from '../../components/DashboardCard';
import treinamentDoneImg from '../../assets/images/done-treinament.svg';
import provesSentImg from '../../assets/images/proves-sent.svg';
import activeSellersImg from '../../assets/images/active-sellers.svg';
import SellersActiveDashboard from '../../components/ProductivityByZoneDashboard';
import ProductsPieDashboard from '../../components/ProductsStackBarDashboard';
import ActivitiesDashboard from '../../components/ActivitiesDashboard';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { drawerOpen } = useSelector((state: StoreState) => state.template);

  const currentRoute = allRoutes.find((r) => r.id === 'dashboard');

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
    <div id="home-page">
      <Helmet>
        <title>{currentRoute?.title ?? ''}</title>
        <meta name="description" content="Editar o perfil do usuário" />
      </Helmet>
      <div className="cards">
        <DashboardCard backgroundColor="linear-gradient(to right, #2c3e50, #bdc3c7)" image={activeSellersImg} legend="Vendedores Ativos" value="256" />
        <DashboardCard backgroundColor="linear-gradient(to right, #1f4037, #99f2c8)" image={provesSentImg} legend="Comprovações Enviadas" value="684" />
        <DashboardCard backgroundColor="linear-gradient(to right, #4286f4, #373B44)" image={treinamentDoneImg} legend="Treinamentos Concluídos" value="1326" />
      </div>
      <div className="dashs" style={{ width: drawerOpen ? 'calc(100vw - 330px)' : 'calc(100vw - 140px)' }}>
        <div>
          <SellersActiveDashboard />
        </div>
        <div style={{ height: '400px' }}>
          <ProductsPieDashboard />
        </div>
      </div>
      <Card className="activities-dash-area">
        <h2>Crescimento Atividades</h2>
        <ActivitiesDashboard />
      </Card>
    </div>
  );
};

export default DashboardPage;

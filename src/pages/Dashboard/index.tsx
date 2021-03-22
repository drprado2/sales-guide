import React, { useEffect, useState } from 'react';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  useParams,
  useRouteMatch,
  Prompt,
  Link,
  useHistory,
} from 'react-router-dom';
import { Card } from 'primereact/card';
import { allRoutes, signOutRequest } from '../../store/modules/auth/slice';
import { resetBreadcrumbTo, setCurrentPage } from '../../store/modules/template/slice';
import { HomeParams } from '../../routes/authenticated.route';
import useQuery from '../../routes/useQuery.hook';
import { StoreState } from '../../store';
import DashboardCard from '../../components/DashboardCard';
import treinamentDoneImg from '../../assets/images/done-treinament.svg';
import provesSentImg from '../../assets/images/proves-sent.svg';
import activeSellersImg from '../../assets/images/active-sellers.svg';
import SellersActiveDashboard from '../../components/SellersActiveDashboard';
import ProductsPieDashboard from '../../components/ProductsStackBarDashboard';
import ActivitiesDashboard from '../../components/ActivitiesDashboard';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { companyId } = useParams<HomeParams>();
  const { path, url } = useRouteMatch();
  const [isBlocking, setIsBlocking] = useState(false);
  const query = useQuery();
  const history = useHistory();
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

  function onLogout() {
    dispatch(signOutRequest());
  }

  function onGoToPageWithQueryParam() {
    history.push('/home/444?name=adriano');
  }

  return (
    <div id="home-page">
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

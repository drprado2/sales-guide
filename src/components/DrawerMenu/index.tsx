import React from 'react';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent, SidebarFooter,
} from 'react-pro-sidebar';
// @ts-ignore
import Burger from 'react-css-burger';
import { authorizedRoutes } from '../../store/modules/auth/slice';
import { StoreState } from '../../store';

const DrawerMenu = () => {
  const { t } = useTranslation(['translation']);

  const { roles } = useSelector((state: StoreState) => state.auth);
  const dispatch = useDispatch();
  const { drawerOpen } = useSelector((state: StoreState) => state.template);
  const history = useHistory();

  const { routeId } = useSelector(
    (state: StoreState) => state.template,
  );

  console.log(routeId);

  return (
    <ProSidebar
      collapsed={!drawerOpen}
      className="drawer-menu"
      breakPoint="sm"
    >
      <SidebarHeader>
        {
          drawerOpen ? <div className="logo-area" /> : <div className="empty-logo-area" />
        }
      </SidebarHeader>
      <SidebarContent>
        <Menu iconShape="circle">
          {authorizedRoutes(roles).filter((r) => r.showOnMenu).map((r) => (
            <MenuItem active={r.id === routeId} icon={r.icon}>
              {t`${r.title}`}
              <Link to={r.path} />
            </MenuItem>
          ))}
        </Menu>
      </SidebarContent>
      <SidebarFooter style={{ textAlign: 'center' }}>
        <div
          className="sidebar-btn-wrapper"
        >
          {drawerOpen && <span>Sales Guide</span>}
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default DrawerMenu;

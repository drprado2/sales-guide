import React, { useState } from 'react';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent, SidebarFooter,
} from 'react-pro-sidebar';
// @ts-ignore
import Burger from 'react-css-burger';
import { StoreState } from '../../store';

const DrawerMenu = () => {
  const { t } = useTranslation(['translation']);

  const { roles, authorizedRoutes } = useSelector((state: StoreState) => state.auth);
  const dispatch = useDispatch();
  const { drawerOpen } = useSelector((state: StoreState) => state.template);
  const history = useHistory();
  const [openSubMenu, setOpenSubMenu] = useState<Array<string>>([]);

  const { routeId } = useSelector(
    (state: StoreState) => state.template,
  );

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
          {authorizedRoutes.filter((r) => r.showOnMenu).map((r) => (
            r.isGrouper ? (
              <SubMenu
                onClick={() => {
                  if (openSubMenu.some((os) => os === r.id)) {
                    setOpenSubMenu(openSubMenu.filter((os) => os !== r.id));
                  } else {
                    setOpenSubMenu(openSubMenu.concat(r.id));
                  }
                }}
                key={r.id}
                open={r.subPages.some((ir) => ir.id === routeId) || openSubMenu.some((os) => os === r.id)}
                title={r.title}
                icon={r.icon}
              >
                {r.subPages.map((sr) => (
                  <MenuItem key={sr.id} active={sr.id === routeId}>
                    {t`${sr.title}`}
                    <Link to={sr.path} />
                  </MenuItem>
                ))}
              </SubMenu>
            ) : (
              <MenuItem key={r.id} active={r.id === routeId} icon={r.icon}>
                {t`${r.title}`}
                <Link to={r.path} />
              </MenuItem>
            )
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

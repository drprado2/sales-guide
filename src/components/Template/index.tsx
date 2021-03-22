import React, { PropsWithChildren, useEffect, useState } from 'react';
import './styles.scss';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { FaBeer } from 'react-icons/fa';
import { Divider } from 'primereact/divider';
import { StoreState } from '../../store';
import { allRoutes } from '../../store/modules/auth/slice';
import { Route } from '../../store/modules/auth/types';

interface Props {
  header?: JSX.Element,
  drawer?: JSX.Element,
  breadcrumb?: JSX.Element,
  content?: JSX.Element,
  footer?: JSX.Element,
}

const Template: React.FC<Props> = (props: PropsWithChildren<Props>) => {
  const { roles } = useSelector((state: StoreState) => state.auth);
  const { icon, title } = useSelector((state: StoreState) => state.template);
  const [currentIcon, setCurrentIcon] = useState<JSX.Element|null>(null);

  const location = useLocation();

  const {
    header, drawer, breadcrumb, content, footer,
  } = props;

  useEffect(() => {
    if (icon?.type) {
      setCurrentIcon(icon);
    }
  }, [icon]);

  return (
    <template id="template">
      <div className="header-effect" />
      {drawer
        ? (<nav id="drawer">{drawer}</nav>) : null}
      {header
        ? (<header>{header}</header>) : null}
      {breadcrumb
        ? (
          <div id="breadcrumb">
            <nav>{breadcrumb}</nav>
          </div>
        ) : null}
      {content
        ? (<main>{content}</main>) : null}
      {footer
        ? (<footer>{footer}</footer>) : null}
    </template>
  );
};

export default Template;

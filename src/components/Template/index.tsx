import React, {
  PropsWithChildren, useEffect, useRef, useState,
} from 'react';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollTop } from 'primereact/scrolltop';
import { Toast } from 'primereact/toast';
import { StoreState } from '../../store';
import { ErrorType } from '../../store/types/Error';
import { clearErrors } from '../../store/modules/errors/slice';

interface Props {
  header?: JSX.Element,
  drawer?: JSX.Element,
  breadcrumb?: JSX.Element,
  content?: JSX.Element,
  footer?: JSX.Element,
}

const Template: React.FC<Props> = (props: PropsWithChildren<Props>) => {
  const dispatch = useDispatch();
  const {
    icon, pageImage, drawerOpen,
  } = useSelector((state: StoreState) => state.template);
  const errorToast = useRef<Toast>(null);

  const { errors } = useSelector(
    (state: StoreState) => state.errors,
  );

  const {
    header, drawer, breadcrumb, content, footer,
  } = props;

  let headerEffectClass = pageImage ? 'header-effect' : 'header-effect withot-page-img';
  headerEffectClass = drawerOpen ? `${headerEffectClass} drawer-open` : headerEffectClass;

  useEffect(() => {
    if (errors?.length > 0) {
      errorToast?.current?.show({
        severity: 'error', summary: 'Erro ao salvar!', detail: errors.map((e) => e.message).join(', '), life: 3000,
      });
      dispatch(clearErrors());
    }
  }, [errors]);

  return (
    <template id="template">
      <Toast ref={errorToast} />
      <div className={headerEffectClass} />
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
      <ScrollTop threshold={200} />
    </template>
  );
};

export default Template;

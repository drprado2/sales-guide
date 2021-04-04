import React, {
  ChangeEvent, FormEventHandler, useEffect, useRef, useState,
} from 'react';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'primereact/card';
import {
  useHistory, useLocation, Prompt,
} from 'react-router-dom';
import { Skeleton } from 'primereact/skeleton';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Zoom } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { InputTextarea } from 'primereact/inputtextarea';
import { allRoutes } from '../../../store/modules/auth/slice';
import { setCurrentPage, pushBreadcrumb } from '../../../store/modules/template/slice';
import {
  setCreateFormField, resetCreateForm, createRequest, validateCreateForm,
} from '../../../store/modules/zones/slice';
import { StoreState } from '../../../store';
import { isValid } from '../../../store/validations/validations';

const CreateZonePage = () => {
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [isBlocking, setIsBlocking] = useState(false);

  const currentRoute = allRoutes.find((r) => r.id === 'create-zone');
  const listRoute = allRoutes.find((r) => r.id === 'zone-list');

  const {
    loadingSaveForm, createForm,
  } = useSelector((state: StoreState) => state.zones);

  const goToList = () => {
    history.push(listRoute?.path ?? '/');
  };

  useEffect(() => {
    if (currentRoute) {
      dispatch(setCurrentPage({
        icon: currentRoute.icon,
        routeId: currentRoute.id,
        title: currentRoute.title,
        pageImage: currentRoute.pageImage,
      }));
      dispatch(pushBreadcrumb({
        path: location.pathname,
        routeId: currentRoute.id,
        title: currentRoute.title,
      }));
    }
  }, [currentRoute]);

  useEffect(() => () => {
    dispatch(resetCreateForm());
  }, []);

  const onSaveSuccess = () => {
    toast.current?.show({
      severity: 'success', summary: 'Salvo!', detail: 'Região salva com sucesso!', life: 1500,
    });
    setTimeout(goToList, 1500);
  };

  const onFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setIsBlocking(false);
    dispatch(createRequest(onSaveSuccess));
  };

  return (
    <>
      <Helmet>
        <title>{currentRoute?.title ?? 'Criar Região'}</title>
        <meta name="description" content="Criar uma região" />
      </Helmet>
      <Zoom in>
        <div id="edit-zone-page" className="p-grid p-align-center">
          <Toast ref={toast} />
          <Prompt
            when={isBlocking}
            message={(loc) =>
              'Deseja realmente prosseguir? suas alterações serão perdidas.'
            }
          />
          <Card className="p-col-12 p-xl-10" style={{ position: 'relative' }}>
            {loadingSaveForm && (
              <>
                <Skeleton className="p-skeleton-loader" />
                <ProgressSpinner className="loader-app" />
              </>
            )}
            <form onSubmit={onFormSubmit}>
              <div className="p-grid">
                <div className="p-col-6">
                  <span className="p-float-label">
                    <InputText
                      id="name"
                      aria-describedby="name-help"
                      className={createForm.name?.errors?.length > 0 ? 'p-invalid' : ''}
                      value={createForm.name.value}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setIsBlocking(true);
                        dispatch(setCreateFormField({ fieldName: e.target.id, value: e.target.value }));
                      }}
                    />
                    <small id="name-help" className="p-error p-d-block">{createForm.name.errors.join(', ')}</small>
                    <label htmlFor="name">Nome</label>
                  </span>
                </div>
                <div className="p-col-6">
                  <span className="p-float-label">
                    <InputTextarea
                      id="description"
                      aria-describedby="description-help"
                      className={createForm.description?.errors?.length > 0 ? 'p-invalid' : ''}
                      value={createForm.description.value}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                        setIsBlocking(true);
                        dispatch(setCreateFormField({ fieldName: e.target.id, value: e.target.value }));
                      }}
                      rows={5}
                      cols={30}
                      autoResize
                    />
                    <small id="name-help" className="p-error p-d-block">{createForm.description.errors.join(', ')}</small>
                    <label htmlFor="description">Descrição</label>
                  </span>
                </div>
              </div>
              <div className="p-grid btn-area" style={{ marginTop: '20px', justifyContent: 'flex-end' }}>
                <Button type="button" label="Cancelar" className="p-button-text" onClick={goToList} />
                <Button type="submit" label="Salvar" disabled={!isValid(createForm)} />
              </div>
            </form>
          </Card>
        </div>
      </Zoom>
    </>
  );
};

export default CreateZonePage;

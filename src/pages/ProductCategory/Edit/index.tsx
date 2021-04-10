import React, {
  ChangeEvent, FormEventHandler, useEffect, useRef, useState,
} from 'react';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'primereact/card';
import {
  useHistory, useParams, useLocation, Prompt,
} from 'react-router-dom';
import { Skeleton } from 'primereact/skeleton';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { generatePath } from 'react-router';
import { Toast } from 'primereact/toast';
import { Zoom } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { InputTextarea } from 'primereact/inputtextarea';
import { allRoutes } from '../../../store/modules/auth/slice';
import { setCurrentPage, pushBreadcrumb } from '../../../store/modules/template/slice';
import {
  getById, setUpdateFormField, resetUpdateForm, updateRequest,
} from '../../../store/modules/productCategories/slice';
import { StoreState } from '../../../store';
import { isValid } from '../../../store/validations/validations';
import { fileToBase64 } from '../../../utils/file-utils';

const EditProductCategoryPage = () => {
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [isBlocking, setIsBlocking] = useState(false);
  const iconUploadRef = useRef<HTMLInputElement>(null);

  const currentRoute = allRoutes.find((r) => r.id === 'edit-productCategory');
  const listRoute = allRoutes.find((r) => r.id === 'productsGrouper')?.subPages.find((r) => r.id === 'productCategory-list');

  const {
    loadingSaveForm, updateForm, loadingGetById, viewData,
  } = useSelector((state: StoreState) => state.productCategories);

  const { id } = useParams<{id: string}>();

  const goToList = () => {
    history.push(listRoute?.path ?? '/');
  };

  useEffect(() => {
    if ((!id || id === ':id')) {
      goToList();
    }
  }, [id]);

  useEffect(() => {
    if (!updateForm.id?.value) {
      dispatch(getById(id));
    }
  }, [updateForm]);

  const pageTitle = viewData?.name ? `Editando categoria ${viewData.name}` : currentRoute?.title ?? '';

  useEffect(() => {
    if (currentRoute) {
      dispatch(setCurrentPage({
        icon: currentRoute.icon,
        routeId: currentRoute.id,
        title: pageTitle,
        pageImage: currentRoute.pageImage,
      }));
      dispatch(pushBreadcrumb({
        path: location.pathname,
        routeId: currentRoute.id,
        title: pageTitle,
      }));
    }
  }, [currentRoute, viewData]);

  useEffect(() => () => {
    dispatch(resetUpdateForm());
  }, []);

  const onSaveSuccess = () => {
    toast.current?.show({
      severity: 'success', summary: 'Salvo!', detail: 'Categoria salva com sucesso!', life: 1500,
    });
    setTimeout(goToList, 1500);
  };

  const onIconSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setIsBlocking(true);
      const file = event.target.files[0];
      const base64 = await fileToBase64(file);
      dispatch(setUpdateFormField({ fieldName: 'icon', value: base64 }));
    }
  };

  const onFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setIsBlocking(false);
    dispatch(updateRequest(onSaveSuccess));
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Editar uma categoria de produto" />
      </Helmet>
      <Zoom in>
        <div id="edit-productCategory-page" className="p-grid p-align-center">
          <Toast ref={toast} />
          <Prompt
            when={isBlocking}
            message={(loc) =>
              'Deseja realmente prosseguir? suas alterações serão perdidas.'
            }
          />
          <Card className="p-col-12 p-xl-10" style={{ position: 'relative' }}>
            {(loadingSaveForm || loadingGetById) && (
              <>
                <Skeleton className="p-skeleton-loader" />
                <ProgressSpinner className="loader-app" />
              </>
            )}
            <form onSubmit={onFormSubmit}>
              <div className="p-grid">
                <div className="p-col-1">
                  <div className="icon-area p-shadow-3" style={{ backgroundImage: `url(${updateForm.icon.value})` }}>
                    <label className="label-icon" htmlFor="icon">Ícone</label>
                    <input onChange={onIconSelected} style={{ display: 'none' }} ref={iconUploadRef} type="file" id="icon" name="icon" accept="image/png, image/jpeg" />
                    <Button type="button" icon="pi pi-camera" className="p-button-rounded p-button-primary p-button-sm" htmlFor="icon" onClick={() => iconUploadRef.current?.click()} />
                  </div>
                </div>
                <div className="p-col-5">
                  <span className="p-float-label">
                    <InputText
                      id="name"
                      aria-describedby="name-help"
                      className={updateForm.name?.errors?.length > 0 ? 'p-invalid' : ''}
                      value={updateForm.name.value}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setIsBlocking(true);
                        dispatch(setUpdateFormField({ fieldName: e.target.id, value: e.target.value }));
                      }}
                    />
                    <small id="name-help" className="p-error p-d-block">{updateForm.name.errors.join(', ')}</small>
                    <label htmlFor="name">Nome</label>
                  </span>
                </div>
                <div className="p-col-6">
                  <span className="p-float-label">
                    <InputTextarea
                      id="description"
                      aria-describedby="description-help"
                      className={updateForm.description?.errors?.length > 0 ? 'p-invalid' : ''}
                      value={updateForm.description.value}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                        setIsBlocking(true);
                        dispatch(setUpdateFormField({ fieldName: e.target.id, value: e.target.value }));
                      }}
                      rows={5}
                      cols={30}
                      autoResize
                    />
                    <small id="name-help" className="p-error p-d-block">{updateForm.description.errors.join(', ')}</small>
                    <label htmlFor="description">Descrição</label>
                  </span>
                </div>
              </div>
              <div className="p-grid btn-area" style={{ marginTop: '20px', justifyContent: 'flex-end' }}>
                <Button type="button" label="Cancelar" className="p-button-text" onClick={goToList} />
                <Button type="submit" label="Salvar" disabled={!isValid(updateForm)} />
              </div>
            </form>
          </Card>
        </div>
      </Zoom>
    </>
  );
};

export default EditProductCategoryPage;

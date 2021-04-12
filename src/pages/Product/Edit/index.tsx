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
import { Toast } from 'primereact/toast';
import { Zoom } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { InputTextarea } from 'primereact/inputtextarea';
import { DropzoneArea } from 'material-ui-dropzone';
import { Dropdown } from 'primereact/dropdown';
import { TabView, TabPanel } from 'primereact/tabview';
import { allRoutes } from '../../../store/modules/auth/slice';
import { setCurrentPage, pushBreadcrumb } from '../../../store/modules/template/slice';
import {
  getById, setUpdateFormField, resetUpdateForm, updateRequest,
} from '../../../store/modules/products/slice';
import { StoreState } from '../../../store';
import { isValid } from '../../../store/validations/validations';
import { fileToBase64 } from '../../../utils/file-utils';
import CreateProductCategoryModal from '../../ProductCategory/components/CreateModal';
import { getOptions } from '../../../store/modules/productCategories/slice';
import RegisterTreinament from '../components/RegisterTreinament';

const EditProductPage = () => {
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [isBlocking, setIsBlocking] = useState(false);
  const mainImageRef = useRef<HTMLInputElement>(null);
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);

  const currentRoute = allRoutes.find((r) => r.id === 'edit-product');
  const listRoute = allRoutes.find((r) => r.id === 'productsGrouper')?.subPages.find((r) => r.id === 'product-list');

  const {
    loadingSaveForm, updateForm, loadingGetById, viewData, updateTreinamentForm,
  } = useSelector((state: StoreState) => state.products);
  const categoryOptions = useSelector((state: StoreState) => state.productCategories.options);
  const loadingCategoryOptions = useSelector((state: StoreState) => state.productCategories.loadingOptions);

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

  const pageTitle = viewData?.name ? `Editando produto ${viewData.name}` : currentRoute?.title ?? '';

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

  useEffect(() => {
    dispatch(getOptions());
    return () => {
      dispatch(resetUpdateForm());
    };
  }, []);

  const onSaveSuccess = () => {
    toast.current?.show({
      severity: 'success', summary: 'Salvo!', detail: 'Produto salvo com sucesso!', life: 1500,
    });
    setTimeout(goToList, 1500);
  };

  const onMainImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setIsBlocking(true);
      const file = event.target.files[0];
      const base64 = await fileToBase64(file);
      dispatch(setUpdateFormField({ fieldName: 'mainImage', value: base64 }));
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
        <meta name="description" content="Editar uma produto" />
      </Helmet>
      <Zoom in>
        <div id="edit-product-page" className="p-grid p-align-center">
          <Toast ref={toast} />
          <Prompt
            when={isBlocking}
            message={(loc) =>
              'Deseja realmente prosseguir? suas alterações serão perdidas.'
            }
          />
          <CreateProductCategoryModal
            isOpen={createCategoryOpen}
            onSave={() => {
              dispatch(getOptions());
              setCreateCategoryOpen(false);
            }}
            onCancel={() => setCreateCategoryOpen(false)}
          />
          <Card className="p-col-12 p-xl-10" style={{ position: 'relative' }}>
            {(loadingSaveForm || loadingGetById) && (
              <>
                <Skeleton className="p-skeleton-loader" />
                <ProgressSpinner className="loader-app" />
              </>
            )}
            <form onSubmit={onFormSubmit}>
              <TabView>
                <TabPanel header="Informações" leftIcon="pi pi-info-circle">
                  <div className="p-grid">
                    <div className="p-col-6">
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
                        <div className="p-inputgroup">
                          <Dropdown
                            disabled={loadingCategoryOptions}
                            id="categoryId"
                            optionLabel="label"
                            optionValue="value"
                            value={updateForm?.categoryId?.value}
                            options={categoryOptions}
                            onChange={(e) => {
                              setIsBlocking(true);
                              dispatch(setUpdateFormField({ fieldName: 'categoryId', value: e.value }));
                            }}
                          />
                          <label style={{ marginLeft: 12 }} htmlFor="categoryId">Categoria</label>
                          <Button type="button" icon="pi pi-plus" onClick={() => setCreateCategoryOpen(true)} />
                        </div>
                        <small id="zoneId-help" className="p-error p-d-block">{updateForm.categoryId.errors.join(', ')}</small>
                      </span>
                    </div>
                    <div className="p-col-2">
                      <div className="image-area p-shadow-3" style={{ backgroundImage: `url(${updateForm.mainImage.value})` }}>
                        <label className="image-label" htmlFor="mainImage">Foto Principal</label>
                        <input onChange={onMainImageSelect} style={{ display: 'none' }} ref={mainImageRef} type="file" id="mainImage" name="mainImage" accept="image/png, image/jpeg" />
                        <Button type="button" icon="pi pi-camera" className="p-button-rounded p-button-primary" htmlFor="mainImage" onClick={() => mainImageRef.current?.click()} />
                      </div>
                    </div>
                    <div className="p-col-10">
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
                    <div className="p-col-12">
                      <label htmlFor="images">Fotos</label>
                      {
                        (updateForm?.images?.value ?? []).length === 0 ? <div /> : (
                          <DropzoneArea
                            initialFiles={updateForm.images.value}
                            acceptedFiles={['image/*']}
                            dropzoneText="Arraste e solte as imagens ou clique!"
                            onChange={(files) => console.log('Files:', files)}
                            getFileAddedMessage={(fileName) => `Arquivo ${fileName} adicionado.`}
                            getFileRemovedMessage={(fileName) => `Arquivo ${fileName} removido.`}
                            getFileLimitExceedMessage={(limit) => `Não pode ter mais do que ${limit} arquivos.`}
                            previewGridProps={{ container: { spacing: 1, direction: 'row' }, item: { sm: 2 } }}
                            filesLimit={20}
                          />
                        )
                      }
                    </div>
                  </div>
                </TabPanel>
                <TabPanel header="Conteúdo Aplicativo" leftIcon="pi pi-mobile">
                  Aqui vao conteudos
                </TabPanel>
                <TabPanel header="Treinamento" leftIcon="pi pi-book">
                  <RegisterTreinament />
                </TabPanel>
              </TabView>
              <div className="p-grid btn-area" style={{ marginTop: '20px', justifyContent: 'flex-end' }}>
                <Button type="button" label="Cancelar" className="p-button-text" onClick={goToList} />
                <Button type="submit" label="Salvar" disabled={!isValid(updateForm) || !isValid(updateTreinamentForm)} />
              </div>
            </form>
          </Card>
        </div>
      </Zoom>
    </>
  );
};

export default EditProductPage;

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
import { ChromePicker } from 'react-color';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Divider } from 'primereact/divider';
import { allRoutes } from '../../store/modules/auth/slice';
import { setCurrentPage, pushBreadcrumb } from '../../store/modules/template/slice';
import {
  getCompanyRequest, setFormField, resetEditCompanyForm, updateCompanyRequest,
} from '../../store/modules/company/slice';
import { StoreState } from '../../store';
import { isValid } from '../../store/validations/validations';
import { fileToBase64 } from '../../utils/file-utils';

const EditCompanyPage = () => {
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [isBlocking, setIsBlocking] = useState(false);
  const primaryColorPickerRef = useRef<OverlayPanel>(null);
  const primaryFontColorPickerRef = useRef<OverlayPanel>(null);
  const secondaryColorPickerRef = useRef<OverlayPanel>(null);
  const secondaryFontColorPickerRef = useRef<OverlayPanel>(null);

  const inputUploadRef = useRef<HTMLInputElement>(null);

  const currentRoute = allRoutes.find((r) => r.id === 'edit-company');
  const viewRoute = allRoutes.find((r) => r.id === 'view-company');

  const {
    loadingSaveForm, editCompanyForm, loadingGetCompany, company,
  } = useSelector((state: StoreState) => state.company);
  const signedinCompanyId = useSelector((state: StoreState) => state.auth.user.companyId);

  const { id } = useParams<{id: string}>();

  const goToView = () => {
    history.push(generatePath(viewRoute?.path ?? '/', { id: signedinCompanyId }));
  };

  useEffect(() => {
    if ((!id || id === ':id') && signedinCompanyId) {
      console.log('VEJA O IDDDD', id);
      goToView();
    }
  }, [id, signedinCompanyId]);

  useEffect(() => {
    if (!editCompanyForm.id?.value) {
      dispatch(getCompanyRequest());
    }
  }, [editCompanyForm]);

  const pageTitle = company?.name ? `Editando ${company.name}` : currentRoute?.title ?? '';

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
  }, [currentRoute, company]);

  useEffect(() => () => {
    dispatch(resetEditCompanyForm());
  }, []);

  const onLogoSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setIsBlocking(true);
      const file = event.target.files[0];
      const base64 = await fileToBase64(file);
      dispatch(setFormField({ fieldName: 'logo', value: base64 }));
    }
  };

  const onSaveSuccess = () => {
    toast.current?.show({
      severity: 'success', summary: 'Salvo!', detail: 'Empresa salva com sucesso', life: 1500,
    });
    setTimeout(goToView, 1500);
  };

  const onFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setIsBlocking(false);
    dispatch(updateCompanyRequest(onSaveSuccess));
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Editar a empresa" />
      </Helmet>
      <Zoom in>
        <div id="edit-company-page" className="p-grid p-align-center">
          <Toast ref={toast} />
          <Prompt
            when={isBlocking}
            message={(loc) =>
              'Deseja realmente prosseguir? suas alterações serão perdidas.'
            }
          />
          <Card className="p-col-12 p-xl-10" style={{ position: 'relative' }}>
            {(loadingSaveForm || loadingGetCompany) && (
              <>
                <Skeleton className="p-skeleton-loader" />
                <ProgressSpinner className="loader-app" />
              </>
            )}
            <form onSubmit={onFormSubmit}>
              <div className="p-grid">
                <div className="p-col-fixed" style={{ width: '220px' }}>
                  <div className="logo-wrapper">
                    <img className="image-area p-shadow-3" src={editCompanyForm.logo.value} alt="selecionar logomarca" />
                    <input onChange={onLogoSelected} style={{ display: 'none' }} ref={inputUploadRef} type="file" id="logo" name="logo" accept="image/png, image/jpeg" />
                    <Button type="button" icon="pi pi-camera" className="p-button-rounded p-button-primary" htmlFor="logo" onClick={() => inputUploadRef.current?.click()} />
                  </div>
                </div>
                <div className="p-col p-grid">
                  <div className="p-col-12">
                    <span className="p-float-label">
                      <InputText
                        id="name"
                        aria-describedby="name-help"
                        className={editCompanyForm.name?.errors?.length > 0 ? 'p-invalid' : ''}
                        value={editCompanyForm.name.value}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setIsBlocking(true);
                          dispatch(setFormField({ fieldName: 'name', value: e.target.value }));
                        }}
                      />
                      <small id="name-help" className="p-error p-d-block">{editCompanyForm.name.errors.join(', ')}</small>
                      <label htmlFor="name">Nome</label>
                    </span>
                  </div>
                  <Divider align="center">
                    <div className="p-d-inline-flex p-ai-center">
                      Cor Primária
                    </div>
                  </Divider>
                  <div className="p-col-6 color-col">
                    <label htmlFor="name">Cor:</label>
                    <div id="primaryColor" className="color-picker-result p-shadow-3" style={{ backgroundColor: editCompanyForm.primaryColor.value }} onClick={(e) => primaryColorPickerRef?.current?.toggle(e)} />
                    <OverlayPanel ref={primaryColorPickerRef} showCloseIcon dismissable>
                      <ChromePicker
                        disableAlpha
                        color={editCompanyForm.primaryColor.value}
                        onChangeComplete={(color, event) => {
                          setIsBlocking(true);
                          dispatch(setFormField({ fieldName: 'primaryColor', value: color.hex }));
                        }}
                      />
                    </OverlayPanel>
                  </div>
                  <div className="p-col-6 color-col">
                    <label htmlFor="primaryFontColor">Cor da Fonte:</label>
                    <div id="primaryFontColor" className="color-picker-result p-shadow-3" style={{ backgroundColor: editCompanyForm.primaryFontColor.value }} onClick={(e) => primaryFontColorPickerRef?.current?.toggle(e)} />
                    <OverlayPanel ref={primaryFontColorPickerRef} showCloseIcon dismissable>
                      <ChromePicker
                        disableAlpha
                        color={editCompanyForm.primaryFontColor.value}
                        onChangeComplete={(color, event) => {
                          setIsBlocking(true);
                          dispatch(setFormField({ fieldName: 'primaryFontColor', value: color.hex }));
                        }}
                      />
                    </OverlayPanel>
                  </div>
                  <Divider align="center">
                    <div className="p-d-inline-flex p-ai-center">
                      Cor Secundária
                    </div>
                  </Divider>
                  <div className="p-col-6 color-col">
                    <label htmlFor="name">Cor:</label>
                    <div id="secondaryColor" className="color-picker-result p-shadow-3" style={{ backgroundColor: editCompanyForm.secondaryColor.value }} onClick={(e) => secondaryColorPickerRef?.current?.toggle(e)} />
                    <OverlayPanel ref={secondaryColorPickerRef} showCloseIcon dismissable>
                      <ChromePicker
                        disableAlpha
                        color={editCompanyForm.secondaryColor.value}
                        onChangeComplete={(color, event) => {
                          setIsBlocking(true);
                          dispatch(setFormField({ fieldName: 'secondaryColor', value: color.hex }));
                        }}
                      />
                    </OverlayPanel>
                  </div>
                  <div className="p-col-6 color-col">
                    <label htmlFor="secondaryFontColor">Cor da Fonte:</label>
                    <div id="secondaryFontColor" className="color-picker-result p-shadow-3" style={{ backgroundColor: editCompanyForm.secondaryFontColor.value }} onClick={(e) => secondaryFontColorPickerRef?.current?.toggle(e)} />
                    <OverlayPanel ref={secondaryFontColorPickerRef} showCloseIcon dismissable>
                      <ChromePicker
                        disableAlpha
                        color={editCompanyForm.secondaryFontColor.value}
                        onChangeComplete={(color, event) => {
                          setIsBlocking(true);
                          dispatch(setFormField({ fieldName: 'secondaryFontColor', value: color.hex }));
                        }}
                      />
                    </OverlayPanel>
                  </div>
                </div>
              </div>
              <div className="p-grid btn-area" style={{ marginTop: '20px', justifyContent: 'flex-end' }}>
                <Button type="button" label="Cancelar" className="p-button-text" onClick={goToView} />
                <Button type="submit" label="Salvar" disabled={!isValid(editCompanyForm)} />
              </div>
            </form>
          </Card>
        </div>
      </Zoom>
    </>
  );
};

export default EditCompanyPage;

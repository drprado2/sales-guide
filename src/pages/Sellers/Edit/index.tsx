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
import { InputMask } from 'primereact/inputmask';
import { InputSwitch } from 'primereact/inputswitch';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { allRoutes } from '../../../store/modules/auth/slice';
import { setCurrentPage, pushBreadcrumb } from '../../../store/modules/template/slice';
import {
  getById, setUpdateFormField, resetUpdateForm, updateRequest, validateCreateForm,
} from '../../../store/modules/sellers/slice';
import {
  getOptions,
} from '../../../store/modules/zones/slice';
import { StoreState } from '../../../store';
import { isValid } from '../../../store/validations/validations';
import { fileToBase64 } from '../../../utils/file-utils';
import { setFormField } from '../../../store/modules/user-profile/slice';
import CreateZoneModal from '../../Zone/components/CreateModal';

const EditSellerPage = () => {
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [isBlocking, setIsBlocking] = useState(false);
  const [createZoneOpen, setCreateZoneOpen] = useState(false);
  const inputUploadRef = useRef<HTMLInputElement>(null);
  const {
    loadingSaveForm, updateForm, loadingGetById, viewData,
  } = useSelector((state: StoreState) => state.sellers);
  const zoneOptions = useSelector((state: StoreState) => state.zones.options);
  const loadingZoneOptions = useSelector((state: StoreState) => state.zones.loadingOptions);

  const onAvatarSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setIsBlocking(true);
      const file = event.target.files[0];
      const base64 = await fileToBase64(file);
      dispatch(setUpdateFormField({ fieldName: 'avatarImage', value: base64 }));
    }
  };

  const currentRoute = allRoutes.find((r) => r.id === 'edit-seller');
  const listRoute = allRoutes.find((r) => r.id === 'seller-list');

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

  useEffect(() => {
    if (viewData?.document?.length <= 14) {
      dispatch(setUpdateFormField({ fieldName: 'isCpf', value: true }));
    } else {
      dispatch(setUpdateFormField({ fieldName: 'isCpf', value: false }));
    }
  }, [viewData]);

  const pageTitle = viewData?.name ? `Editando vendedor ${viewData.name}` : currentRoute?.title ?? '';

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
      severity: 'success', summary: 'Salvo!', detail: 'Vendedor salvo com sucesso!', life: 1500,
    });
    setTimeout(goToList, 1500);
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
        <meta name="description" content="Editar um vendedor" />
      </Helmet>
      <Zoom in>
        <div id="edit-seller-page" className="p-grid p-align-center">
          <CreateZoneModal
            isOpen={createZoneOpen}
            onSave={() => {
              dispatch(getOptions());
              setCreateZoneOpen(false);
            }}
            onCancel={() => setCreateZoneOpen(false)}
          />
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
                <div className="p-col-12 p-grid">
                  <div className="p-col-2">
                    <div className="image-area p-shadow-3" style={{ backgroundImage: `url(${updateForm.avatarImage.value})` }}>
                      <input onChange={onAvatarSelected} style={{ display: 'none' }} ref={inputUploadRef} type="file" id="avatarImage" name="avatarImage" accept="image/png, image/jpeg" />
                      <Button type="button" icon="pi pi-camera" className="p-button-rounded p-button-primary" htmlFor="avatarImage" onClick={() => inputUploadRef.current?.click()} />
                    </div>
                  </div>
                  <div className="p-col-10 p-grid">
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
                    <div className="p-col-6 cpf-cnpj-wrapper">
                      <span className="p-float-label">
                        {
                          updateForm.isCpf.value
                            ? (
                              <InputMask
                                autoClear={false}
                                id="document"
                                mask="999.999.999-99"
                                value={updateForm.document.value}
                                className={updateForm.document?.errors?.length > 0 ? 'p-invalid' : ''}
                                onChange={(e) => {
                                  if (e.value === undefined) {
                                    return;
                                  }
                                  console.log('atualizando input do cpf', e.value);
                                  setIsBlocking(true);
                                  dispatch(setUpdateFormField({ fieldName: 'document', value: e.value }));
                                }}
                              />
                            )
                            : (
                              <InputMask
                                autoClear={false}
                                id="document"
                                mask="99.999.999/9999-99"
                                value={updateForm.document.value}
                                className={updateForm.document?.errors?.length > 0 ? 'p-invalid' : ''}
                                onChange={(e) => {
                                  if (e.value === undefined) {
                                    return;
                                  }
                                  setIsBlocking(true);
                                  dispatch(setUpdateFormField({ fieldName: 'document', value: e.value }));
                                }}
                              />
                            )
                        }
                        <small id="document-help" className="p-error p-d-block">{updateForm.document.errors.join(', ')}</small>
                        <label htmlFor="document">Documento</label>
                      </span>
                      <div className="cpf-cnpj">
                        <span>CPF/CNPJ</span>
                        <InputSwitch
                          checked={updateForm.isCpf.value}
                          onChange={(e) => {
                            dispatch(setUpdateFormField({ fieldName: 'isCpf', value: e.value }));
                            if (e.value && updateForm?.document?.value?.length > 14) {
                              dispatch(setUpdateFormField({ fieldName: 'document', value: updateForm.document.value.substring(0, 14) }));
                            } else if (updateForm?.document?.value?.length > 0) {
                              dispatch(setUpdateFormField({ fieldName: 'document', value: updateForm.document.value.padEnd(18, '0') }));
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="p-col-6">
                      <span className="p-float-label">
                        <InputMask
                          autoClear={false}
                          id="phone"
                          mask="(99) 99999-9999"
                          value={updateForm.phone.value}
                          className={updateForm.phone?.errors?.length > 0 ? 'p-invalid' : ''}
                          onChange={(e) => {
                            setIsBlocking(true);
                            dispatch(setUpdateFormField({ fieldName: 'phone', value: e.value }));
                          }}
                        />
                        <small id="phone-help" className="p-error p-d-block">{updateForm.phone.errors.join(', ')}</small>
                        <label htmlFor="phone">Telefone</label>
                      </span>
                    </div>
                    <div className="p-col-6 cpf-cnpj-wrapper">
                      <span className="p-float-label">
                        <Calendar
                          id="birthDate"
                          value={updateForm.birthDate?.value ? new Date(updateForm.birthDate.value) : undefined}
                          onChange={(e: any) => {
                            setIsBlocking(true);
                            dispatch(setFormField({ fieldName: 'birthDate', value: e.value }));
                          }}
                          maxDate={new Date()}
                          mask="99/99/9999"
                          dateFormat="dd/mm/yy"
                          showIcon
                          locale="pt-br"
                          showButtonBar
                        />
                        <small id="birthDate-help" className="p-error p-d-block">{updateForm.birthDate.errors.join(', ')}</small>
                        <label htmlFor="birthDate">Data de nascimento</label>
                      </span>
                      <div className="cpf-cnpj" style={{ marginLeft: '30px' }}>
                        <span>Ativo</span>
                        <InputSwitch
                          checked={updateForm.enable?.value}
                          onChange={(e) => {
                            setIsBlocking(true);
                            dispatch(setUpdateFormField({ fieldName: 'enable', value: e.value }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-col-5 p-offset-2" style={{ marginTop: '-12px' }}>
                  <span className="p-float-label" style={{ width: '95%' }}>
                    <div className="p-inputgroup">
                      <Dropdown
                        disabled={loadingZoneOptions}
                        id="zoneId"
                        optionLabel="label"
                        optionValue="value"
                        value={updateForm?.zoneId?.value}
                        options={zoneOptions}
                        onChange={(e) => {
                          setIsBlocking(true);
                          dispatch(setUpdateFormField({ fieldName: 'zoneId', value: e.value }));
                        }}
                      />
                      <label style={{ marginLeft: 12 }} htmlFor="zoneId">Região</label>
                      <Button type="button" icon="pi pi-plus" onClick={() => setCreateZoneOpen(true)} />
                    </div>
                    <small id="zoneId-help" className="p-error p-d-block">{updateForm.zoneId.errors.join(', ')}</small>
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

export default EditSellerPage;

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
  getById, setCreateFormField, resetCreateForm, createRequest, validateCreateForm,
} from '../../../store/modules/sellers/slice';
import {
  getOptions,
} from '../../../store/modules/zones/slice';
import { StoreState } from '../../../store';
import { isValid } from '../../../store/validations/validations';
import { fileToBase64 } from '../../../utils/file-utils';
import { setFormField } from '../../../store/modules/user-profile/slice';
import CreateZoneModal from '../../Zone/components/CreateModal';

const CreateSellerPage = () => {
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [isBlocking, setIsBlocking] = useState(false);
  const [createZoneOpen, setCreateZoneOpen] = useState(false);
  const inputUploadRef = useRef<HTMLInputElement>(null);
  const {
    loadingSaveForm, createForm, loadingGetById,
  } = useSelector((state: StoreState) => state.sellers);
  const zoneOptions = useSelector((state: StoreState) => state.zones.options);
  const loadingZoneOptions = useSelector((state: StoreState) => state.zones.loadingOptions);

  const onAvatarSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setIsBlocking(true);
      const file = event.target.files[0];
      const base64 = await fileToBase64(file);
      dispatch(setCreateFormField({ fieldName: 'avatarImage', value: base64 }));
    }
  };

  const currentRoute = allRoutes.find((r) => r.id === 'create-seller');
  const listRoute = allRoutes.find((r) => r.id === 'seller-list');

  const { id } = useParams<{id: string}>();

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

  useEffect(() => {
    dispatch(getOptions());
    dispatch(validateCreateForm());
    return () => {
      dispatch(resetCreateForm());
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
    dispatch(createRequest(onSaveSuccess));
  };

  return (
    <>
      <Helmet>
        <title>{currentRoute?.title ?? 'Criar Vendedor'}</title>
        <meta name="description" content="Criar um vendedor" />
      </Helmet>
      <Zoom in>
        <div id="create-seller-page" className="p-grid p-align-center">
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
                    <div className="image-area p-shadow-3" style={{ backgroundImage: `url(${createForm.avatarImage.value})` }}>
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
                    <div className="p-col-6 cpf-cnpj-wrapper">
                      <span className="p-float-label">
                        {
                          createForm.isCpf.value
                            ? (
                              <InputMask
                                autoClear={false}
                                id="document"
                                mask="999.999.999-99"
                                value={createForm.document.value}
                                className={createForm.document?.errors?.length > 0 ? 'p-invalid' : ''}
                                onChange={(e) => {
                                  if (e.value === undefined) {
                                    return;
                                  }
                                  setIsBlocking(true);
                                  dispatch(setCreateFormField({ fieldName: 'document', value: e.value }));
                                }}
                              />
                            )
                            : (
                              <InputMask
                                autoClear={false}
                                id="document"
                                mask="99.999.999/9999-99"
                                value={createForm.document.value}
                                className={createForm.document?.errors?.length > 0 ? 'p-invalid' : ''}
                                onChange={(e) => {
                                  if (e.value === undefined) {
                                    return;
                                  }
                                  setIsBlocking(true);
                                  dispatch(setCreateFormField({ fieldName: 'document', value: e.value }));
                                }}
                              />
                            )
                        }
                        <small id="document-help" className="p-error p-d-block">{createForm.document.errors.join(', ')}</small>
                        <label htmlFor="document">Documento</label>
                      </span>
                      <div className="cpf-cnpj">
                        <span>CPF/CNPJ</span>
                        <InputSwitch
                          checked={createForm.isCpf.value}
                          onChange={(e) => {
                            setCreateFormField({ fieldName: 'isCpf', value: e.value });
                            if (e.value && createForm?.document?.value?.length > 14) {
                              dispatch(setCreateFormField({ fieldName: 'document', value: createForm.document.value.substring(0, 14) }));
                            } else if (createForm?.document?.value?.length > 0) {
                              dispatch(setCreateFormField({ fieldName: 'document', value: createForm.document.value.padEnd(18, '0') }));
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
                          value={createForm.phone.value}
                          className={createForm.phone?.errors?.length > 0 ? 'p-invalid' : ''}
                          onChange={(e) => {
                            setIsBlocking(true);
                            dispatch(setCreateFormField({ fieldName: 'phone', value: e.value }));
                          }}
                        />
                        <small id="phone-help" className="p-error p-d-block">{createForm.phone.errors.join(', ')}</small>
                        <label htmlFor="phone">Telefone</label>
                      </span>
                    </div>
                    <div className="p-col-6 cpf-cnpj-wrapper">
                      <span className="p-float-label">
                        <Calendar
                          id="birthDate"
                          value={createForm.birthDate?.value ? new Date(createForm.birthDate.value) : undefined}
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
                        <small id="birthDate-help" className="p-error p-d-block">{createForm.birthDate.errors.join(', ')}</small>
                        <label htmlFor="birthDate">Data de nascimento</label>
                      </span>
                      <div className="cpf-cnpj" style={{ marginLeft: '30px' }}>
                        <span>Ativo</span>
                        <InputSwitch
                          checked={createForm.enable?.value}
                          onChange={(e) => {
                            setIsBlocking(true);
                            dispatch(setCreateFormField({ fieldName: 'enable', value: e.value }));
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
                        value={createForm?.zoneId?.value}
                        options={zoneOptions}
                        onChange={(e) => {
                          setIsBlocking(true);
                          dispatch(setCreateFormField({ fieldName: 'zoneId', value: e.value }));
                        }}
                      />
                      <label style={{ marginLeft: 12 }} htmlFor="zoneId">Região</label>
                      <Button type="button" icon="pi pi-plus" onClick={() => setCreateZoneOpen(true)} />
                    </div>
                    <small id="zoneId-help" className="p-error p-d-block">{createForm.zoneId.errors.join(', ')}</small>
                  </span>
                </div>
                <div className="p-col-5" style={{ marginTop: '-12px', marginLeft: '-16px' }}>
                  <span className="p-float-label">
                    <InputText
                      id="email"
                      aria-describedby="email-help"
                      className={createForm.email?.errors?.length > 0 ? 'p-invalid' : ''}
                      value={createForm.email.value}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setIsBlocking(true);
                        dispatch(setCreateFormField({ fieldName: e.target.id, value: e.target.value }));
                      }}
                    />
                    <small id="email-help" className="p-error p-d-block">{createForm.email.errors.join(', ')}</small>
                    <label htmlFor="email">E-mail</label>
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

export default CreateSellerPage;

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
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { generatePath } from 'react-router';
import { Calendar } from 'primereact/calendar';
import { InputMask } from 'primereact/inputmask';
import { Toast } from 'primereact/toast';
import { Zoom } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { allRoutes } from '../../store/modules/auth/slice';
import { setCurrentPage, pushBreadcrumb } from '../../store/modules/template/slice';
import {
  getUserRequest, setFormField, resetUserProfileForm, updateUserRequest,
} from '../../store/modules/user-profile/slice';
import { StoreState } from '../../store';
import { isValid } from '../../store/validations/validations';
import { fileToBase64 } from '../../utils/file-utils';

const ViewUserProfilePage = () => {
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [isBlocking, setIsBlocking] = useState(false);

  const inputUploadRef = useRef<HTMLInputElement>(null);

  const currentRoute = allRoutes.find((r) => r.id === 'edit-user-profile');
  const viewProfileRoute = allRoutes.find((r) => r.id === 'view-user-profile');

  const {
    loadingSaveForm, profileForm, loadingGetProfile, user,
  } = useSelector((state: StoreState) => state.userProfile);
  const signedinUserId = useSelector((state: StoreState) => state.auth.user.id);

  const { id } = useParams<{id: string}>();

  const goToViewProfile = () => {
    history.push(generatePath(viewProfileRoute?.path ?? '/', { id: signedinUserId }));
  };

  useEffect(() => {
    if ((!id || id === ':id') && signedinUserId) {
      goToViewProfile();
    }
  }, [id, signedinUserId]);

  useEffect(() => {
    if (!profileForm.id?.value) {
      dispatch(getUserRequest());
    }
  }, [profileForm]);

  const pageTitle = user?.name ? `Editando ${user.name}` : currentRoute?.title ?? '';

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
  }, [currentRoute, user]);

  useEffect(() => () => {
    dispatch(resetUserProfileForm());
  }, []);

  const onAvatarSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    console.log('eu aq', event.target.files);
    if (event.target.files) {
      setIsBlocking(true);
      const file = event.target.files[0];
      const base64 = await fileToBase64(file);
      console.log('selecionou arquivo', file, base64);
      dispatch(setFormField({ fieldName: 'avatarImage', value: base64 }));
    }
  };

  const onSaveSuccess = () => {
    toast.current?.show({
      severity: 'success', summary: 'Salvo!', detail: 'Perfil salvo com sucesso', life: 3000,
    });
    setTimeout(goToViewProfile, 1500);
  };

  const onFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setIsBlocking(false);
    dispatch(updateUserRequest(onSaveSuccess));
  };

  const header = <h6>Selecione a senha</h6>;
  const footer = (
    <>
      <Divider />
      <p className="p-mt-2">Sugestões</p>
      <ul className="p-pl-2 p-ml-2 p-mt-0" style={{ lineHeight: '1.5' }}>
        <li>Pelo menos 1 caracter minusculo</li>
        <li>Pelo menos 1 caracter maiusculo</li>
        <li>Pelo menos 1 número</li>
        <li>No mínimo 8 caracteres</li>
      </ul>
    </>
  );

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Editar o perfil do usuário" />
      </Helmet>
      <Zoom in>
        <div id="edit-user-profile-page" className="p-grid p-align-center">
          <Toast ref={toast} />
          <Prompt
            when={isBlocking}
            message={(loc) =>
              'Deseja realmente prosseguir? suas alterações serão perdidas.'
            }
          />
          <Card className="p-col-12 p-xl-10" style={{ position: 'relative' }}>
            {(loadingSaveForm || loadingGetProfile) && (
              <>
                <Skeleton className="p-skeleton-loader" />
                <ProgressSpinner className="loader-app" />
              </>
            )}
            <form onSubmit={onFormSubmit}>
              <div className="p-grid">
                <div className="p-col-fixed" style={{ width: '220px' }}>
                  <div className="image-area p-shadow-3" style={{ backgroundImage: `url(${profileForm.avatarImage.value})` }}>
                    <input onChange={onAvatarSelected} style={{ display: 'none' }} ref={inputUploadRef} type="file" id="avatarImage" name="avatarImage" accept="image/png, image/jpeg" />
                    <Button type="button" icon="pi pi-camera" className="p-button-rounded p-button-primary" htmlFor="avatarImage" onClick={() => inputUploadRef.current?.click()} />
                  </div>
                </div>
                <div className="p-col p-grid">
                  <div className="p-col-6">
                    <span className="p-float-label">
                      <InputText
                        id="name"
                        aria-describedby="name-help"
                        className={profileForm.name?.errors?.length > 0 ? 'p-invalid' : ''}
                        value={profileForm.name.value}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setIsBlocking(true);
                          dispatch(setFormField({ fieldName: 'name', value: e.target.value }));
                        }}
                      />
                      <small id="name-help" className="p-error p-d-block">{profileForm.name.errors.join(', ')}</small>
                      <label htmlFor="name">Nome</label>
                    </span>
                  </div>
                  <div className="p-col-6">
                    <span className="p-float-label">
                      <Password
                        id="password"
                        promptLabel="Digite a senha"
                        weakLabel="Fraca"
                        mediumLabel="Média"
                        strongLabel="Forte"
                        className={profileForm.password?.errors?.length > 0 ? 'p-invalid' : ''}
                        defaultValue={profileForm.password.value}
                        value={profileForm.password.value}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setIsBlocking(true);
                          dispatch(setFormField({ fieldName: 'password', value: e.target.value }));
                        }}
                        header={header}
                        footer={footer}
                        aria-describedby="password-help"
                        toggleMask
                      />
                      <small id="password-help" className="p-error p-d-block">{profileForm.password.errors.join(', ')}</small>
                      <label htmlFor="password">Senha</label>
                    </span>
                  </div>
                  <div className="p-col-6">
                    <span className="p-float-label">
                      <InputMask
                        autoClear={false}
                        id="phone"
                        mask="(99) 99999-9999"
                        value={profileForm.phone.value}
                        className={profileForm.phone?.errors?.length > 0 ? 'p-invalid' : ''}
                        onChange={(e) => {
                          setIsBlocking(true);
                          dispatch(setFormField({ fieldName: 'phone', value: e.value }));
                        }}
                      />
                      <small id="phone-help" className="p-error p-d-block">{profileForm.phone.errors.join(', ')}</small>
                      <label htmlFor="phone">Telefone</label>
                    </span>
                  </div>
                  <div className="p-col-6">
                    <span className="p-float-label">
                      <Calendar
                        id="birthDate"
                        value={profileForm.birthDate?.value ? new Date(profileForm.birthDate.value) : undefined}
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
                      <label htmlFor="birthDate">Data de Nascimento</label>
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-grid btn-area" style={{ marginTop: '20px', justifyContent: 'flex-end' }}>
                <Button type="button" label="Cancelar" className="p-button-text" onClick={goToViewProfile} />
                <Button type="submit" label="Salvar" disabled={!isValid(profileForm)} />
              </div>
            </form>
          </Card>
        </div>
      </Zoom>
    </>
  );
};

export default ViewUserProfilePage;

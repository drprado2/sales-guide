import React, {
  ChangeEvent, FormEvent, useEffect, useRef, useState,
} from 'react';
import './styles.scss';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';
import { Divider } from 'primereact/divider';
import { Checkbox, CheckboxProps } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Toast, ToastMessage, ToastProps } from 'primereact/toast';
import { useAuth0 } from '@auth0/auth0-react';
import { StoreState } from '../../store';
import {
  signInRequest, setLoginEmail, setLoginPassword, setKeepSigned,
} from '../../store/modules/auth/slice';
import {
  clearErrors,
} from '../../store/modules/errors/slice';
import { ErrorType } from '../../store/types/Error';

const SignInPage: React.FC = () => {
  const { t } = useTranslation(['translation', 'loginPage']);

  const toast = useRef<Toast>(null);

  const { loginWithPopup, loginWithRedirect, logout } = useAuth0();

  const showErrors = (errors: ErrorType[]) => {
    errors.forEach((error) => {
      toast?.current?.show({
        severity: 'error', summary: error.title, detail: error.message, life: 3000,
      });
    });
  };

  const {
    loadingSignInRequest, isSignedIn, token, loginForm,
  } = useSelector(
    (state: StoreState) => state.auth,
  );
  const { errors } = useSelector(
    (state: StoreState) => state.errors,
  );
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (errors?.length > 0) {
      showErrors(errors);
      dispatch(clearErrors());
    }
  }, [errors]);

  const login = async (e: any) => {
    e.preventDefault();
    await loginWithRedirect({ display: 'popup', ui_locales: 'pt-BR' });
  };

  return (
    <div id="sign-in-page">
      <Toast ref={toast} position="top-right" />
      <div className="card-wrapper">
        <div className="background-image" />
        <Card>
          <div className="form-wrapper">
            <div className="logo-area" />
            <h1 className="title">{t`Sales Guide`}</h1>
            <Divider align="center">
              <div className="p-d-inline-flex p-ai-center dividir-area">
                <b>acesse sua conta</b>
              </div>
            </Divider>
            <form className="form" action="submit">
              <Button onClick={login} label={t`loginPage:Log in`} icon={loadingSignInRequest ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'} iconPos="right" disabled={loadingSignInRequest} />
            </form>
            <Divider />
            <div className="ask-for-account">{t`loginPage:Don't have an account yet?`} <a href="/">{t`loginPage:Contact sales`}</a></div>
          </div>
          <div className="background-right" />
          <div className="background-left" />
        </Card>
      </div>
    </div>
  );
};

export default SignInPage;

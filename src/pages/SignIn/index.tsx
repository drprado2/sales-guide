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
import { StoreState } from '../../store';
import {
  signInRequest, setLoginEmail, setLoginPassword, setKeepSigned,
} from '../../store/modules/auth/slice';
import {
  clearErrors,
} from '../../store/modules/errors/slice';
import { ErrorType } from '../../store/modules/errors/types';

const SignInPage: React.FC = () => {
  const { t } = useTranslation(['translation', 'loginPage']);

  const toast = useRef<Toast>(null);

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
                <b>{t`loginPage:login with e-mail`}</b>
              </div>
            </Divider>
            <form className="form" action="submit">
              <span className="p-float-label p-input-icon-left">
                <i className="pi pi-user" />
                <InputText id="username" value={loginForm.email} onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch(setLoginEmail(e.target.value))} />
                <label htmlFor="username">{t`loginPage:Your Email`}</label>
              </span>
              <span className="p-float-label p-input-icon-left password-input">
                <i className="pi pi-lock" />
                {
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                  showPassword ? <i onClick={toggleShowPassword} className="pi pi-eye-slash show-pass-icon" /> : <i onClick={toggleShowPassword} className="pi pi-eye show-pass-icon" />
                }
                <InputText id="password" value={loginForm.password} onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch(setLoginPassword(e.target.value))} type={showPassword ? 'text' : 'password'} />
                <label htmlFor="password">{t`loginPage:Your Password`}</label>
              </span>
              <div className="forgot-password-area">
                <div className="p-field-checkbox">
                  <Checkbox inputId="binary" checked={loginForm.keepSigned} onChange={(e: CheckboxProps) => dispatch(setKeepSigned(e.checked || false))} />
                  <label htmlFor="binary">{t`loginPage:Keep me logged in`}</label>
                </div>
                <a href="/">{t`loginPage:Forgot password`}</a>
              </div>
              <Button onClick={() => dispatch(signInRequest(loginForm))} label={t`loginPage:Log in`} icon={loadingSignInRequest ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'} iconPos="right" disabled={loadingSignInRequest} />
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

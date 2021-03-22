import { IconType } from 'react-icons';

export interface LoginForm {
  readonly email: string;
  readonly password: string;
  readonly keepSigned: boolean;
}

export interface User {
  id: string,
  companyId: string,
  name: string,
  email: string,
  password: string,
  avatarImage: string,
  createdAt: Date,
  updatedAt: Date
}

export type Role = 'VIEWER' | 'SELLER' | string;

export type Route = {
  path: string;
  exact: boolean;
  component(): JSX.Element;
  isDefaultForCurrentUser(userRoles: Role[]): boolean;
  roles: Role[];
  title: string;
  icon: JSX.Element;
  id: string;
  pageImage: string | undefined;
  showOnMenu: boolean;
};

export interface AuthState {
  readonly loadingSignInRequest: boolean;
  isSignedIn(): boolean;
  readonly error: boolean;
  token: string | null;
  readonly loginForm: LoginForm;
  readonly user: User;
  roles: string[];
}

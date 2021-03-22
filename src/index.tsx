import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import * as V from 'victory';
import './index.scss';
import { Provider, useSelector } from 'react-redux';
import PrimeReact, { locale } from 'primereact/api';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store, StoreState } from './store';

import './assets/themes/maintheme/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import './i18n';

PrimeReact.ripple = true;

// locale('pt-BR');

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback="loading">
        <App />
      </Suspense>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

reportWebVitals();

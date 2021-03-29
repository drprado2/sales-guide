import React from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { addLocale } from 'primereact/api';
import Routes from './routes';

import './assets/themes/maintheme/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

addLocale('pt-br', {
  firstDayOfWeek: 1,
  dayNames: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
  dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  today: 'Hoje',
  clear: 'Limpar',
});

console.log(
  `Print custom variable, must have REACT_APP_ preffix: ${process.env.REACT_APP_ADRIANO}`,
  process.env,
);

function App() {
  return (
    <Router>
      <Routes />
    </Router>
  );
}

export default App;

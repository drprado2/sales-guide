import React from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';

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

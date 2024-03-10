import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Login } from './user_control/Login';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Outlet />
    </div>
  );
}

export default App;

import React, { useContext } from 'react';
// import logo from './logo.svg';
import './App.css';

import { Outlet } from 'react-router-dom';
import { createContext } from 'react';
import { AuthMandate } from './utils/AuthMandate';

type AuthContextType = { isAuthed: boolean; login: () => void; logout: () => void };

const useAuth = () => {
  const [isAuthed, setIsAuthed] = React.useState(false);
  return {
    isAuthed,
    login: () => {
      setIsAuthed(true);
      console.log('login in useAuth hook');
    },
    logout: () => setIsAuthed(false),
  };
};

// const AuthContext = createContext() as React.Context<AuthContextType>;
const AuthContext = createContext<AuthContextType>({
  isAuthed: false,
  login: () => {},
  logout: () => {},
});

function App() {
  return (
    <AuthContext.Provider value={useAuth()}>
      <AuthMandate>
        <div className="App">
          <Outlet />
        </div>
      </AuthMandate>
    </AuthContext.Provider>
  );
}

export default App;
export const useAuthContext = () => useContext(AuthContext);

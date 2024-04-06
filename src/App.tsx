import './App.css';

import { Outlet } from 'react-router-dom';
import { RouterGuard } from './user_control/RouterGuard';
import { PrimeReactProvider } from 'primereact/api';

function App() {
  return (
    <PrimeReactProvider>
      <div className="App">
        <RouterGuard />
        <Outlet />
      </div>
    </PrimeReactProvider>
  );
}

export default App;

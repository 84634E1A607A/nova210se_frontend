import './App.css';

import { Outlet } from 'react-router-dom';
import { RouterGuard } from './user_control/RouterGuard';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

function App() {
  return (
    <PrimeReactProvider value={{ unstyled: false }}>
      <div className="App">
        <RouterGuard />
        <Outlet />
      </div>
    </PrimeReactProvider>
  );
}

export default App;

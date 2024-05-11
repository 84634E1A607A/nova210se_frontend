import './App.css';

import { Outlet } from 'react-router-dom';
import { RouterGuard } from './user_control/RouterGuard';
import { PrimeReactProvider } from 'primereact/api';
import { UpdateDataCompanion } from './websockets/component/UpdateDataCompanion';
import { CurrentChatProvider } from './chat_control/states/CurrentChatProvider';

function App() {
  return (
    <PrimeReactProvider value={{ unstyled: false }}>
      <div className="App flex">
        <RouterGuard />
        <CurrentChatProvider>
          <Outlet />
          <UpdateDataCompanion />
        </CurrentChatProvider>
      </div>
    </PrimeReactProvider>
  );
}

export default App;

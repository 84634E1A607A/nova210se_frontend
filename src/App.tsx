import './App.css';

import { Outlet } from 'react-router-dom';
import { RouterGuard } from './user_control/RouterGuard';
import { PrimeReactProvider } from 'primereact/api';
import useWebSocket from 'react-use-websocket';
import { UpdateDataCompanion } from './websockets/component/UpdateDataCompanion';

function App() {
  const { lastJsonMessage, lastMessage } = useWebSocket(process.env.REACT_APP_WEBSOCKET_URL!, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    shouldReconnect: (_closeEvent) => true,
    reconnectInterval: 1000,
    share: true,
  });
  console.log('lastJsonMessage', lastJsonMessage);
  console.log('lastMessage', lastMessage);

  return (
    <PrimeReactProvider value={{ unstyled: false }}>
      <div className="App">
        <RouterGuard />
        <Outlet />
        <UpdateDataCompanion />
      </div>
    </PrimeReactProvider>
  );
}

export default App;

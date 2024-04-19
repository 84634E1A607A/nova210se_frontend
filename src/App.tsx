import './App.css';

import { Outlet } from 'react-router-dom';
import { RouterGuard } from './user_control/RouterGuard';
import { PrimeReactProvider } from 'primereact/api';
import useWebSocket from 'react-use-websocket';

function App() {
  const { lastJsonMessage, lastMessage } = useWebSocket(process.env.REACT_APP_WEBSOCKET_URL!, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    share: true,
  });
  console.log('lastJsonMessage', lastJsonMessage);
  console.log('lastMessage', lastMessage);

  return (
    <PrimeReactProvider value={{ unstyled: false }}>
      <div className="App">
        <RouterGuard />
        {/*<div className="min-w-[50rem]">*/}
        <Outlet />
        {/*</div>*/}
      </div>
    </PrimeReactProvider>
  );
}

export default App;

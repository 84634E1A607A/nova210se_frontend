import './App.css';

import { Outlet } from 'react-router-dom';
import { RouterGuard } from './user_control/RouterGuard';

function App() {
  return (
    <div className="App">
      <RouterGuard />
      <Outlet />
    </div>
  );
}

export default App;

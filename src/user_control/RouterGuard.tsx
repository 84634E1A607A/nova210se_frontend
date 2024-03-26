import { useEffect } from 'react';
import { getUserInfo } from './getUserInfo';
import { useLocation, useNavigate } from 'react-router-dom';
import { isValidPath } from './isValidPath';

export function RouterGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const state = location.state;

  useEffect(() => {
    async function checkIsValidPath() {
      const userInfo = await getUserInfo();
      const userName = userInfo?.user_name;
      if (userName === undefined) navigate('/login');
      else if (isValidPath(path, userName)) {
        if (path[path.length - 1] === '/') navigate(path.slice(0, -1), { state: state });
        else navigate(path, { state: state });
      } else navigate(`/${userName}/invalid`);
    }

    if (path !== '/login' && path !== '/') checkIsValidPath();
    else navigate('/login');
  }, [navigate, path, state]);

  return <></>;
}

import { useEffect } from 'react';
import { getUserInfo } from './getUserInfo';
import { useLocation, useNavigate } from 'react-router-dom';
import { isValidPath } from './isValidPath';

export function RouterGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    async function checkIsValidPath(toRoot?: boolean) {
      const userInfo = await getUserInfo();
      const userName = userInfo?.user_name;
      if (userName === undefined) navigate('/login');
      else if (!isValidPath(path, userName)) navigate(`/${userName}/invalid`);
      if (toRoot) navigate(`/${userName}`);
    }

    if (path !== '/login' && path !== '/') checkIsValidPath();
    else if (path === '/login') navigate('/login');
    else checkIsValidPath(true);
  }, [navigate, path]);

  return <></>;
}

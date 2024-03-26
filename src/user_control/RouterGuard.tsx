import { useEffect } from 'react';
import { getUserInfo } from './getUserInfo';
import { useLocation, useNavigate } from 'react-router-dom';
import { isValidPath } from './isValidPath';

export function RouterGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    async function checkIsValidPath() {
      const userInfo = await getUserInfo();
      const userName = userInfo?.user_name;
      if (userName === undefined) navigate('/login');
      else if (!isValidPath(path, userName)) navigate(`/${userName}/invalid`);
    }

    if (path !== '/login' && path !== '/') checkIsValidPath();
    else navigate('/login');
  }, [navigate, path]);

  return <></>;
}

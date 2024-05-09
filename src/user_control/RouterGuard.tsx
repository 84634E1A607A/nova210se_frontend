import { useEffect } from 'react';
import { getUserInfo } from './getUserInfo';
import { useLocation, useNavigate } from 'react-router-dom';
import { isValidPath } from './isValidPath';

export function RouterGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    function checkIsValidPath(toRoot?: boolean) {
      getUserInfo().then((userInfo) => {
        if (userInfo === undefined) {
          navigate('/login');
          return;
        }
        const userName = userInfo.user_name;
        if (!isValidPath(path, userName)) navigate(`/${userName}/invalid`);
        if (toRoot) navigate(`/${userName}`);
      });
    }

    if (path !== '/login' && path !== '/') checkIsValidPath();
    else if (path === '/login') navigate('/login');
    else checkIsValidPath(true);
  }, [navigate, path]);

  return <></>;
}

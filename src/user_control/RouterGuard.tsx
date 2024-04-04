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
      getUserInfo()
        .then((userInfo) => {
          if (userInfo === undefined) {
            navigate('/login');
            return;
          }
          const userName = userInfo.user_name;
          if (!isValidPath(path, userName)) navigate(`/${userName}/invalid`);
          if (toRoot) navigate(`/${userName}`);
        })
        .catch((e) => {
          if (e.name === 'AssertionError') navigate('/login');
          else throw new Error(e);
        });
    }

    if (path !== '/login' && path !== '/') checkIsValidPath();
    else if (path === '/login') navigate('/login');
    else checkIsValidPath(true);
  }, [navigate, path]);

  return <></>;
}

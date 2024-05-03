import { Link, Navigate, useRouteError } from 'react-router-dom';
import { getUserInfo } from '../user_control/getUserInfo';
import { useQuery } from '@tanstack/react-query';

export function ErrorPage() {
  const error = useRouteError();

  const { data: userInfo, isLoading } = useQuery({ queryFn: getUserInfo, queryKey: ['user_name'] });

  if (isLoading) return <div>An error message is loading...</div>;
  if (userInfo === undefined) return <Navigate to="/login" />;
  return (
    <>
      <div className="p-5 text-center text-xl">
        <h1 className="text-xl text-slate-900">Sorry, an error has occurred</h1>
        {isError(error) && <p className="text-base text-slate-700">{error.statusText}</p>}
        <nav>
          <Link to={`/${userInfo.user_name}`}>Click to return to main page.</Link>
        </nav>
      </div>
    </>
  );
}

function isError(error: any): error is { statusText: string } {
  return 'statusText' in error;
}

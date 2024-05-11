import { useParams } from 'react-router-dom';

type UrlParams = { user_name: string; chat_id?: string };

function useUrlParams() {
  const params = useParams<UrlParams>();
  const userName = params.user_name!;
  return { userName };
}

export function useUserName() {
  const { userName } = useUrlParams();
  return userName;
}

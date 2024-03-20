import { useParams } from 'react-router-dom';
import { UrlParams } from './types';

export function useUserName() {
  const params = useParams<UrlParams>();
  return params.user_name!;
}

import { Link, useParams } from 'react-router-dom';
import { UrlParams } from '../utils/types';

export function DisplayCurrentUserInfo() {
  const params = useParams<UrlParams>();
  const userName = params.user_name!;
  return (
    <div>
      <h2>DisplayUserInfo</h2>
      <Link to={`/${userName}/invitation_list`}>Invitations</Link>
    </div>
  );
}

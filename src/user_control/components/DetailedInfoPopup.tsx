import { DetailedUserInfo } from '../../utils/Types';
import { Avatar } from '../../utils/ui/Avatar';

export function DetailedInfoPopup({
  detailedInfo: { user_name, id, email, phone, nickname, avatar_url },
}: Props) {
  return (
    <div className="max-h-15 flex max-w-32 flex-col items-center ">
      <div className="my-2 h-10 w-4">
        <Avatar url={avatar_url} enablePopup={false} />
      </div>
      <div className="items-start" style={{ maxWidth: 250 }}>
        <div className="mr-2 mt-1 flex items-center">
          <span className="ml-2 mr-2 font-medium">ID:</span>
          <span className="mr-2 block truncate" title={`${id}`}>
            {id}
          </span>
        </div>
        <div className="mr-2 mt-1 flex items-center">
          <span className="ml-2 mr-2 font-medium">Username:</span>
          <span className="mr-2 block truncate" title={`${user_name}`}>
            {user_name}
          </span>
        </div>
        {nickname !== undefined && nickname !== '' && (
          <div className="mr-2 mt-1 flex items-center">
            <span className="ml-2 mr-2 font-medium">Nickname:</span>
            <span className="mr-2 block truncate" title={`${nickname}`}>
              {nickname}
            </span>
          </div>
        )}
        {email !== undefined && email !== '' && (
          <div className="mr-2 mt-1 flex items-center" style={{ maxWidth: 250 }}>
            <span className="ml-2 mr-2 font-medium">Email:</span>
            <span className="mr-2 block truncate" title={`${email}`}>
              {email}
            </span>
          </div>
        )}
        {phone !== undefined && phone !== '' && (
          <div className="mr-2 mt-1 flex items-center" style={{ maxWidth: 250 }}>
            <span className="ml-2 mr-2 font-medium">Phone:</span>
            <span className="mr-2 block truncate" title={`${phone}`}>
              {phone}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  detailedInfo: DetailedUserInfo;
}

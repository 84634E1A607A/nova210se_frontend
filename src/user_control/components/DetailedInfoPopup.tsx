import { DetailedUserInfo } from '../../utils/types';
import { Avatar } from '../../utils/ui/Avatar';

export function DetailedInfoPopup({
  detailedInfo: { user_name, id, email, phone, nickname, avatar_url },
}: Props) {
  return (
    <div className="w-32 h-15 m-4 flex flex-col items-center">
      <div className="w-4 h-10">
        <Avatar url={avatar_url} enablePopup={false} />
      </div>

      <div className="items-start m-3" style={{ maxWidth: 250 }}>
        <div className="flex items-center mt-1 mr-2">
          <span className="font-medium mr-2 ml-2">ID:</span>
          <span className="truncate block mr-2" title={`${id}`}>
            {id}
          </span>
        </div>
        <div className="flex items-center mt-1 mr-2">
          <span className="font-medium mr-2 ml-2">Username:</span>
          <span className="truncate block mr-2" title={`${user_name}`}>
            {user_name}
          </span>
        </div>
        {nickname !== undefined && (
          <div className="flex items-center mt-1 mr-2">
            <span className="font-medium mr-2 ml-2">Nickname:</span>
            <span className="truncate block mr-2" title={`${nickname}`}>
              {nickname}
            </span>
          </div>
        )}
        <div className="flex items-center mt-1 mr-2" style={{ maxWidth: 250 }}>
          <span className="font-medium mr-2 ml-2">Email:</span>
          <span className="truncate block mr-2" title={`${email}`}>
            {email === undefined || email === '' ? 'N/A' : email}
          </span>
        </div>
        <div className="flex items-center mt-1 mr-2" style={{ maxWidth: 250 }}>
          <span className="font-medium mr-2 ml-2">Phone:</span>
          <span className="truncate block mr-2" title={`${phone}`}>
            {phone === undefined || phone === '' ? 'N/A' : phone}
          </span>
        </div>
      </div>
    </div>
  );
}

interface Props {
  detailedInfo: DetailedUserInfo;
}

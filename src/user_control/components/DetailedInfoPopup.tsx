import { DetailedUserInfo } from '../../utils/Types';
import { Avatar } from '../../utils/ui/Avatar';

export function DetailedInfoPopup({
  detailedInfo: { user_name, id, email, phone, nickname, avatar_url },
}: Props) {
  return (
    <div className="h-15 m-4 flex w-32 flex-col items-center ">
      <div className="h-10 w-4">
        <Avatar url={avatar_url} enablePopup={false} />
      </div>

      <div className="m-3 items-start" style={{ maxWidth: 250 }}>
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
        {nickname !== undefined && (
          <div className="mr-2 mt-1 flex items-center">
            <span className="ml-2 mr-2 font-medium">Nickname:</span>
            <span className="mr-2 block truncate" title={`${nickname}`}>
              {nickname}
            </span>
          </div>
        )}
        <div className="mr-2 mt-1 flex items-center" style={{ maxWidth: 250 }}>
          <span className="ml-2 mr-2 font-medium">Email:</span>
          <span className="mr-2 block truncate" title={`${email}`}>
            {email === undefined || email === '' ? 'N/A' : email}
          </span>
        </div>
        <div className="mr-2 mt-1 flex items-center" style={{ maxWidth: 250 }}>
          <span className="ml-2 mr-2 font-medium">Phone:</span>
          <span className="mr-2 block truncate" title={`${phone}`}>
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

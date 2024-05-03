import { Tag } from 'primereact/tag';
import { Avatar } from '../../utils/ui/Avatar';
import { DetailedMemberInfo } from '../pages/MoreOfChat';
import { parseDisplayName } from '../../friend_control/utils/parseDisplayName';

/**
 * @description For a tab to simply display a member in details/more of a chat, like that of `#Command` in `https://primereact.org/contextmenu/`.
 * It can be right-clicked to manipulate this member (a stranger or a friend).
 * @warning The caller must ensure that the param `user` is not undefined.
 */
export function SingleUserTab({ user, isPrivateChat }: Props) {
  const purview = isPrivateChat ? 'Friend' : user.isOwner ? 'Owner' : user.isAdmin ? 'Admin' : '';

  const getBadge = (member: DetailedMemberInfo) => {
    if (member.isFriend || user.isMe) return 'success';
    else if (member.isOwner || member.isAdmin) return 'info';
    else return 'warning';
  };

  return (
    <>
      <div className="flex align-items-center gap-2">
        <div className="w-8 h-8">
          <Avatar url={user.avatar_url} enablePopup={true} detailedInfo={user} />
        </div>
        <div className="flex flex-row ">
          <span className="font-bold">
            {parseDisplayName({ nickname: user.nickname, userName: user.user_name })}
          </span>
          <span className="ml-3 text-slate-400">{user.isMe ? 'Me' : '  '}</span>
        </div>
      </div>
      <Tag value={purview === '' ? 'Member' : purview} severity={getBadge(user)} />
    </>
  );
}

interface Props {
  user: DetailedMemberInfo;
  isPrivateChat: boolean;
}

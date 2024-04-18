import { Tag } from 'primereact/tag';
import { Avatar } from '../../utils/ui/Avatar';
import { DetailedMemberInfo } from '../pages/MoreOfChat';

interface Props {
  user: DetailedMemberInfo;
}

/**
 * @description For a tab to simply display a member in details/more of a chat, like that of `#Command` in `https://primereact.org/contextmenu/`.
 * It can be right-clicked to manipulate this member (a stranger or a friend).
 * @warning The caller must ensure that the param `user` is not undefined.
 */
export function SingleUserTab({ user }: Props) {
  const purview = user.isOwner ? 'Owner' : user.isAdmin ? 'Admin' : '';

  // to be polished, don't know what's the meaning
  const getBadge = (user: DetailedMemberInfo) => {
    if ((user.isOwner || user.isAdmin) && !user.isFriend) return 'warning';
    else if (user.isFriend) return 'info';
    else return null;
  };

  return (
    <>
      <div className="flex align-items-center gap-2">
        <div className="w-8 h-8">
          <Avatar url={user.avatar_url} />
        </div>
        <div className="flex flex-row ">
          <span className="font-bold">{user.user_name}</span>
          <span className="ml-3 text-slate-400">{user.isMe ? 'Me' : '  '}</span>
        </div>
      </div>
      <Tag value={purview === '' ? 'Member' : purview} severity={getBadge(user)} />
    </>
  );
}

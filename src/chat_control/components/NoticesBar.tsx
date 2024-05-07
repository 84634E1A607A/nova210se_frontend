import { NoticeCard } from './NoticeCard';
import { ChatRelatedWithCurrentUser } from '../../utils/Types';

/**
 * @description Show the notifications/notices in a group chat beneath the header.
 */
export function NoticesBar({ chat }: Props) {
  if (chat.chat.chat_name === '') {
    // private chat
    return null;
  }

  return (
    <div className="ml-2 flex flex-col p-0.5">
      <div
        className="m-0.5 block truncate text-left text-xs"
        title={`${chat.chatName} Public Notices`}
      >
        <p className="inline">{chat.chatName}</p>
        <p className="inline text-gray-400">{' Public Notices'}</p>
      </div>

      <NoticeCard notice={'None'} />
    </div>
  );
}

interface Props {
  chat: ChatRelatedWithCurrentUser;
}

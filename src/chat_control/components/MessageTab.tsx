import { MessageContent } from './MessageContent';
import { Avatar } from '../../utils/ui/Avatar';
import { LeastUserInfo } from '../../utils/types';
import { systemUserName } from '../../utils/ConstValues';

/**
 * @description The whole message tab, including the avatar of the sender, the message content, etc.
 */
export function MessageTab({ message, isSelf, name, sender }: Props) {
  const isSystemInfo = sender.user_name === systemUserName;
  if (isSystemInfo) return <p className="m-2 text-gray-500">{message}</p>;
  return (
    <div className="flex flex-row h-fit w-fit">
      <div className="flex flex-col">
        <div className="w-8 h-7">
          <Avatar url={sender.avatar_url} enablePopup={true} detailedInfo={sender} />
        </div>
        <p className="text-gray-400 mt-0.5">{name}</p>
      </div>
      <MessageContent message={message} isSelf={isSelf} />
    </div>
  );
}

/**
 * @param message The message content.
 * @param isSelf Whether the sender is the current user.
 * @param name The name of the sender to directly display.
 * @param sender The `LeastUserInfo` of the sender.
 */
interface Props {
  message: string;
  isSelf: boolean;
  name: string;
  sender: LeastUserInfo;
}

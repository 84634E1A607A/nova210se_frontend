import { Badge } from 'primereact/badge';
import { ChatRelatedWithCurrentUser } from '../../utils/Types';
import { Link } from 'react-router-dom';
import { useUserName } from '../../utils/UrlParamsHooks';

interface Props {
  chat: ChatRelatedWithCurrentUser;
}

/**
 * @usage The caller must guarantee that `chat` must have `chatName` property, and it's not undefined.
 */
export function SingleChatTab({ chat }: Props) {
  const userName = useUserName();

  return (
    <Link to={`/${userName}/chats/${chat.chat_id}`}>
      <div className="p-d-flex p-ai-center mt-2 h-10">
        <div className="ml-2 flex flex-row">
          <span className="p-mr-2">{chat.chatName}</span>
          {chat.unread_count > 0 && (
            <Badge className="block h-min w-min" value={chat.unread_count} severity="danger" />
          )}
        </div>
        <span className="block max-w-36 truncate" title={chat.chat.last_message.message}>
          {chat.chat.last_message.message}
        </span>
      </div>
    </Link>
  );
}

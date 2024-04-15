import { Badge } from 'primereact/badge';
import { ChatRelatedWithCurrentUser } from '../../utils/types';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
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
      <div className="p-d-flex p-ai-center h-10 mt-2">
        <div className="flex flex-row ml-2">
          <span className="p-mr-2">{chat.chatName}</span>
          {chat.unread_count > 0 && (
            <Badge className="block w-min h-min" value={chat.unread_count} severity="danger" />
          )}
        </div>
        <span className="block max-w-36 truncate" title={chat.chat.last_message.message}>
          {chat.chat.last_message.message}
        </span>
      </div>
    </Link>
  );
}

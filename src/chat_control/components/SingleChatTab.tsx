import { Badge } from 'primereact/badge';
import { ChatRelatedWithCurrentUser } from '../../utils/Types';

interface Props {
  chat: ChatRelatedWithCurrentUser;
}

/**
 * @usage The caller must guarantee that `chat` must have `chatName` property, and it's not undefined.
 */
export function SingleChatTab({ chat }: Props) {
  return (
    <div className="p-d-flex p-ai-center mt-2 h-10 cursor-pointer">
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
  );
}

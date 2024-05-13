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
    <div className="p-d-flex p-ai-center border-top-1 surface-border relative mt-2 h-auto w-auto cursor-pointer rounded-md bg-teal-100 p-2">
      {chat.unread_count > 0 && (
        <Badge
          className="absolute -left-0 -top-1 block h-min w-min"
          value={chat.unread_count}
          severity="danger"
        />
      )}
      <div className="ml-5 flex flex-row px-2">
        <span className="p-mr-2">{chat.chatName}</span>
      </div>
      <span className="ml-3 block max-w-36 truncate" title={chat.chat.last_message.message}>
        {chat.chat.last_message.message}
      </span>
    </div>
  );
}

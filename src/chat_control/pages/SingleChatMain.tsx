import { useChatId } from '../../utils/UrlParamsHooks';
import { ChatHeader } from './ChatHeader';
import { useChatsRelatedContext } from './ChatMainPageFramework';
import { DialogBox } from './DialogBox';
import { Dialogs } from './Dialogs';
import { RepliedMessageProvider } from '../states/RepliedMessageProvider';
import { MessageRefsProvider } from '../states/MessageRefsProvider';

/**
 * @layout ChatHeader (including button for settings and details of this chat)
 * @layout Dialogs (all the chats, the core component)
 * @layout DialogBox
 *
 * @warn The caller must guarantee that `chatName` is contained within at least the `currentChat` object.
 */
export function SingleChatMain() {
  const { chatsRelatedWithCurrentUser } = useChatsRelatedContext();
  const chatId = useChatId();
  const currentChat = chatsRelatedWithCurrentUser.find((chat) => chat.chat_id === chatId);

  return (
    <div className="flex flex-col">
      <ChatHeader chat={currentChat!} />
      <RepliedMessageProvider>
        <MessageRefsProvider>
          <Dialogs chat={currentChat!} />
        </MessageRefsProvider>
        <DialogBox chat={currentChat!} />
      </RepliedMessageProvider>
    </div>
  );
}

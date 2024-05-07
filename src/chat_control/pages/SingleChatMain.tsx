import { useChatId } from '../../utils/UrlParamsHooks';
import { ChatHeader } from './ChatHeader';
import { useChatsRelatedContext } from './ChatMainPageFramework';
import { DialogBox } from './DialogBox';
import { Dialogs } from './Dialogs';
import { RepliedMessageProvider } from '../states/RepliedMessageProvider';
import { MessageRefsProvider } from '../states/MessageRefsProvider';
import { DialogBoxRefProvider } from '../states/DialogBoxRefProvider';
import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { sendReadMessagesC2SActionWS } from '../../websockets/Actions';

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

  const { sendJsonMessage } = useWebSocket(process.env.REACT_APP_WEBSOCKET_URL!, {
    share: true,
  });

  // send to server that this user has read the messages in this chat
  useEffect(() => {
    const interval = setInterval(() => {
      sendJsonMessage({ action: sendReadMessagesC2SActionWS, data: { chat_id: chatId } });
    }, 1100);

    return () => clearInterval(interval);
  }, [chatId, sendJsonMessage]);

  return (
    <div className="flex flex-col">
      <ChatHeader chat={currentChat!} />
      <RepliedMessageProvider>
        <DialogBoxRefProvider>
          <MessageRefsProvider>
            <Dialogs chat={currentChat!} />
          </MessageRefsProvider>
          <DialogBox chat={currentChat!} />
        </DialogBoxRefProvider>
      </RepliedMessageProvider>
    </div>
  );
}

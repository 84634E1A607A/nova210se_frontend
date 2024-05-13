import { ChatHeader } from './ChatHeader';
import { DialogBox } from './DialogBox';
import { Dialogs } from './Dialogs';
import { RepliedMessageProvider } from '../states/RepliedMessageProvider';
import { MessageRefsProvider } from '../states/MessageRefsProvider';
import { DialogBoxRefProvider } from '../states/DialogBoxRefProvider';
import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { sendReadMessagesC2SActionWS } from '../../websockets/Actions';
import { getChatInfo } from '../getChatInfo';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ChatRelatedWithCurrentUser, Friend, LeastUserInfo } from '../../utils/Types';
import { useCurrentChatContext } from '../states/CurrentChatProvider';
import { useRefetchContext } from '../states/RefetchProvider';

/**
 * @layout ChatHeader (including button for settings and details of this chat)
 * @layout Dialogs (all the chats, the core component)
 * @layout DialogBox
 */
export function SingleChatMain({ user, friends }: Props) {
  const { currentChat, setRightComponent, setCurrentChat } = useCurrentChatContext();
  const chatId = currentChat!.chat_id;
  const { sendJsonMessage } = useWebSocket(process.env.REACT_APP_WEBSOCKET_URL!, {
    share: true,
  });

  const navigate = useNavigate();
  const currentRouterUrl = useLocation().pathname;
  const queryClient = useQueryClient();
  const { chatsRefetch } = useRefetchContext();

  useEffect(() => {
    /** @description When click this chat, if there are unread messages, refresh the unread count. */
    if (currentChat!.unread_count !== 0) {
      // send to server that this user has read the messages in this chat when click and enter this chat page
      // `UpdateDataCompanion` will then deal with the 'messages_read' message sent by the server
      sendJsonMessage({
        action: sendReadMessagesC2SActionWS,
        data: { chat_id: chatId },
      });

      // to prevent dead loop of useEffect
      setCurrentChat({
        ...currentChat,
        unread_count: 0,
      } as ChatRelatedWithCurrentUser);
    }
  }, [
    currentChat,
    chatId,
    currentRouterUrl,
    navigate,
    queryClient,
    sendJsonMessage,
    user.user_name,
    chatsRefetch,
    setCurrentChat,
  ]);

  /** @description If the chat is unauthorized for this user, jump to chats page. */
  useEffect(() => {
    getChatInfo({ chatId }).then((fetchedCurrentChat) => {
      if (fetchedCurrentChat === undefined) {
        setRightComponent(undefined);
        setCurrentChat(null);
      }
    });
  }, [chatId, navigate, user.user_name, setCurrentChat, setRightComponent]);

  return (
    <div className="flex h-screen max-h-screen flex-col overflow-hidden">
      <ChatHeader chat={currentChat!} setRightComponent={setRightComponent} />
      <div className="mb-3 w-full border-b-4 border-l"></div>
      <RepliedMessageProvider>
        <DialogBoxRefProvider>
          <MessageRefsProvider>
            <Dialogs chat={currentChat!} user={user} friends={friends} />
          </MessageRefsProvider>
          <DialogBox chat={currentChat!} />
          <div className="mb-3 w-full border-l border-white"></div>
        </DialogBoxRefProvider>
      </RepliedMessageProvider>
    </div>
  );
}

interface Props {
  user: LeastUserInfo;
  friends: Friend[];
}

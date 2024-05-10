import { useChatId, useUserName } from '../../utils/UrlParamsHooks';
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
import { getChatInfo } from '../getChatInfo';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ChatRelatedWithCurrentUser } from '../../utils/Types';

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

  const userName = useUserName();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // when click this chat, if there are unread messages, refresh the unread count
    if (currentChat!.unread_count !== 0) {
      // send to server that this user has read the messages in this chat when click and enter into this chat page
      sendJsonMessage({ action: sendReadMessagesC2SActionWS, data: { chat_id: chatId } });

      queryClient.setQueryData<ChatRelatedWithCurrentUser[]>(
        ['chats_related_with_current_user'],
        (oldChats) => {
          return oldChats!.map((chat) => {
            if (chat.chat_id === chatId) {
              return {
                ...chat,
                unread_count: 0,
              };
            }
            return chat;
          });
        },
      );
      navigate(`/${userName}/chats`);
    }
  }, [currentChat, chatId, navigate, queryClient, sendJsonMessage, userName]);

  useEffect(() => {
    getChatInfo({ chatId }).then((fetchedCurrentChat) => {
      if (fetchedCurrentChat === undefined) {
        navigate(`/${userName}/chats`);
      }
    });
  }, [chatId, navigate, userName]);

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

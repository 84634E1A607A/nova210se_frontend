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
import {
  ChatRelatedWithCurrentUser,
  DetailedMessage,
  Friend,
  LeastUserInfo,
} from '../../utils/Types';

/**
 * @layout ChatHeader (including button for settings and details of this chat)
 * @layout Dialogs (all the chats, the core component)
 * @layout DialogBox
 */
export function SingleChatMain({
  chatId,
  chat,
  setRightComponent,
  messages,
  user,
  friends,
}: Props) {
  const { sendJsonMessage } = useWebSocket(process.env.REACT_APP_WEBSOCKET_URL!, {
    share: true,
  });

  const navigate = useNavigate();
  const currentRouterUrl = useLocation().pathname;
  const queryClient = useQueryClient();

  useEffect(() => {
    // when click this chat, if there are unread messages, refresh the unread count
    if (chat!.unread_count !== 0) {
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
      navigate(currentRouterUrl);
    }
  }, [chat, chatId, navigate, queryClient, sendJsonMessage, user.user_name]);

  useEffect(() => {
    getChatInfo({ chatId }).then((fetchedCurrentChat) => {
      if (fetchedCurrentChat === undefined) {
        navigate(`/${user.user_name}/chats`);
      }
    });
  }, [chatId, navigate, user.user_name]);

  return (
    <div className="flex flex-col">
      <ChatHeader chat={chat} setRightComponent={setRightComponent} />
      <RepliedMessageProvider>
        <DialogBoxRefProvider>
          <MessageRefsProvider>
            <Dialogs chat={chat} messages={messages} user={user} friends={friends} />
          </MessageRefsProvider>
          <DialogBox chat={chat} />
        </DialogBoxRefProvider>
      </RepliedMessageProvider>
    </div>
  );
}

interface Props {
  chatId: number;
  chat: ChatRelatedWithCurrentUser;
  setRightComponent: any;
  messages: DetailedMessage[];
  user: LeastUserInfo;
  friends: Friend[];
}

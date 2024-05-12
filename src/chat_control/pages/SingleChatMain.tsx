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
import { Friend, LeastUserInfo } from '../../utils/Types';
import { useCurrentChatContext } from '../states/CurrentChatProvider';

/**
 * @layout ChatHeader (including button for settings and details of this chat)
 * @layout Dialogs (all the chats, the core component)
 * @layout DialogBox
 */
export function SingleChatMain({ setRightComponent, user, friends }: Props) {
  const { currentChat } = useCurrentChatContext();
  const chatId = currentChat!.chat_id;
  const { sendJsonMessage } = useWebSocket(process.env.REACT_APP_WEBSOCKET_URL!, {
    share: true,
  });

  const navigate = useNavigate();
  const currentRouterUrl = useLocation().pathname;
  const queryClient = useQueryClient();

  useEffect(() => {
    // when click this chat, if there are unread messages, refresh the unread count
    if (currentChat!.unread_count !== 0) {
      // send to server that this user has read the messages in this chat when click and enter into this chat page
      sendJsonMessage({
        action: sendReadMessagesC2SActionWS,
        data: { chat_id: chatId },
      });
      queryClient.removeQueries({ queryKey: ['chats_related_with_current_user'] });
      navigate(currentRouterUrl);
    }
  }, [
    currentChat,
    chatId,
    currentRouterUrl,
    navigate,
    queryClient,
    sendJsonMessage,
    user.user_name,
  ]);

  /** @description If the chat is unauthorized for this user, jump to chats page. */
  useEffect(() => {
    getChatInfo({ chatId }).then((fetchedCurrentChat) => {
      if (fetchedCurrentChat === undefined) {
        navigate(`/${user.user_name}/chats`);
      }
    });
  }, [chatId, navigate, user.user_name]);

  return (
    <div className="flex flex-col">
      <ChatHeader chat={currentChat!} setRightComponent={setRightComponent} />
      <RepliedMessageProvider>
        <DialogBoxRefProvider>
          <MessageRefsProvider>
            <Dialogs chat={currentChat!} user={user} friends={friends} />
          </MessageRefsProvider>
          <DialogBox chat={currentChat!} />
        </DialogBoxRefProvider>
      </RepliedMessageProvider>
    </div>
  );
}

interface Props {
  setRightComponent: any;
  user: LeastUserInfo;
  friends: Friend[];
}

import useWebSocket from 'react-use-websocket';
import { useEffect, useRef } from 'react';
import { assertIsS2CMessage } from '../AssertsWS';
import {
  receiveApplicationForChatS2CActionWS,
  receiveChatDeletedS2CActionWS,
  receiveFriendDeletedS2CActionWS,
  receiveMemberAddedS2CActionWS,
  receiveMemberRemovedS2CActionWS,
  receiveMessageDeletedS2CActionWS,
  receiveMessageS2CActionWS,
  receiveReadMessagesS2CActionWS,
  sendReadMessagesC2SActionWS,
} from '../Actions';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  chatsRouterUrl,
  invitationsRouterUrl,
  loginRouterUrl,
} from '../../utils/router/RouterPaths';
import { useUserName } from '../../utils/router/RouteParamsHooks';
import { getUserInfo } from '../../user_control/getUserInfo';
import { useCurrentChatContext } from '../../chat_control/states/CurrentChatProvider';
import { Toast } from 'primereact/toast';
import { useRefetchContext, tryToRefetch } from '../../chat_control/states/RefetchProvider';
import { updateChatState } from '../../chat_control/states/updateChatState';

/**
 * @description If websocket message is received, remove the corresponding cache and re-navigate
 * to the desired page.
 */
export function UpdateDataCompanion() {
  const userName = useUserName();
  const queryClient = useQueryClient();

  const { lastJsonMessage, sendJsonMessage } = useWebSocket(process.env.REACT_APP_WEBSOCKET_URL!, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    shouldReconnect: (_closeEvent) => true,
    reconnectInterval: 1500,
    share: true,
  });

  useEffect(() => {
    // should be only for DEV phase
    console.log('lastJsonMessage:', lastJsonMessage);
  }, [lastJsonMessage]);

  const location = useLocation();
  const currentRouterUrl = location.pathname;
  const state = location.state;

  const navigate = useNavigate();

  const toast = useRef<Toast | null>(null);
  const { currentChat, setCurrentChat, rightComponent, setRightComponent } =
    useCurrentChatContext();
  const { messagesRefetch, chatsRefetch, friendsRefetch } = useRefetchContext();

  useEffect(() => {
    /**
     * @description Deal with unauthorized chat. If current chat is unauthorized, jump to chats page. Else stay still
     * and only reload the data.
     * Unauthorized chat means the chat has been deleted or the user has been removed from the chat or a friend has been
     * deleted.
     * This function should be used under `/:user_id/chats`
     * @param messageSummary The summary message to show in the toast
     * @param messageDetail The detail message to show in the toast
     * @param chatId The chat id notified by web socket. Without it, we'll deal with friendship broken case.
     * @param friendId The friend id notified by web socket. If chatId is undefined, friendId must be defined. Vice versa.
     */
    function dealChatUnauthorized(
      messageSummary: string,
      messageDetail: string,
      chatId: number | undefined,
      friendId: number | undefined,
    ) {
      let shouldJumpToParent = false;
      if (
        chatId === undefined &&
        currentChat?.chat.chat_name === '' &&
        currentChat.chat.chat_members.find((m) => m.id === friendId)
      ) {
        shouldJumpToParent = true;
      }
      if (currentChat?.chat_id === chatId) shouldJumpToParent = true;

      if (shouldJumpToParent) {
        setRightComponent(undefined);
        setCurrentChat(null);
        toast.current?.show({
          severity: 'warn',
          summary: messageSummary,
          detail: messageDetail,
        });
      }
    }

    if (currentRouterUrl.match(loginRouterUrl)) {
      return;
    }
    if (lastJsonMessage) {
      assertIsS2CMessage(lastJsonMessage);
      if (lastJsonMessage.ok) {
        switch (lastJsonMessage.action) {
          case receiveApplicationForChatS2CActionWS:
            queryClient.removeQueries({ queryKey: ['applications_for_chat'] });
            if (currentRouterUrl.match(invitationsRouterUrl)) {
              navigate(currentRouterUrl, { preventScrollReset: true });
            }
            break;

          case receiveMessageS2CActionWS:
            // Only in this case or when click the chat should we update the unread count of current user

            if (
              currentRouterUrl.match(chatsRouterUrl) &&
              currentChat?.chat_id === lastJsonMessage.data.message.chat_id &&
              rightComponent === 'chat'
            ) {
              // In exactly the page that needs changing: send 'I've read the messages' to server
              // (no need to update unread count because it's set to zero when enter the chat before)
              sendJsonMessage({
                action: sendReadMessagesC2SActionWS,
                data: { chat_id: lastJsonMessage.data.message.chat_id },
              });
              tryToRefetch(messagesRefetch);
            }

            tryToRefetch(chatsRefetch);
            break;

          case receiveMemberAddedS2CActionWS:
            tryToRefetch(chatsRefetch); // the last message of some chat will certainly be updated

            if (
              currentRouterUrl.match(chatsRouterUrl) &&
              currentChat?.chat_id === lastJsonMessage.data.chat_id
            ) {
              tryToRefetch(messagesRefetch); // to show 'xx approved xx to join the group...'
              if (rightComponent === 'more') {
                updateChatState({
                  chatId: lastJsonMessage.data.chat_id,
                  toast,
                  navigate,
                  userName,
                }).then((newChat) => {
                  if (newChat) setCurrentChat(newChat);
                });
              }
            }
            break;

          case receiveFriendDeletedS2CActionWS:
            tryToRefetch(chatsRefetch);
            tryToRefetch(friendsRefetch);

            if (currentRouterUrl.match(chatsRouterUrl)) {
              dealChatUnauthorized(
                'Friend deleted',
                'The friend has been deleted. No chat any more',
                undefined,
                lastJsonMessage.data.friend.id,
              );

              // member color of the friend in chat detail will correctly change by itself, don't know why
            }

            break;

          case receiveChatDeletedS2CActionWS:
            dealChatUnauthorized(
              'Chat deleted',
              'The chat has been deleted',
              lastJsonMessage.data.chat.chat_id,
              undefined,
            );
            tryToRefetch(chatsRefetch);
            break;

          case receiveMemberRemovedS2CActionWS:
            tryToRefetch(chatsRefetch);
            const deletedUserId = lastJsonMessage.data.user_id as number;
            getUserInfo().then((currentUser) => {
              if (currentUser?.id === deletedUserId && currentRouterUrl.match(chatsRouterUrl)) {
                dealChatUnauthorized(
                  'You have been removed',
                  'You have been removed from the chat',
                  lastJsonMessage.data.chat_id,
                  undefined,
                );
              } else if (currentRouterUrl.match(chatsRouterUrl)) {
                tryToRefetch(messagesRefetch);
                if (rightComponent === 'more') {
                  updateChatState({
                    chatId: lastJsonMessage.data.chat_id,
                    toast,
                    navigate,
                    userName,
                  }).then((newChat) => {
                    if (newChat) setCurrentChat(newChat);
                  });
                }
              }
            });
            break;

          case receiveReadMessagesS2CActionWS:
            if (currentChat?.chat_id === lastJsonMessage.data.chat_id) {
              tryToRefetch(messagesRefetch);
            }
            tryToRefetch(chatsRefetch);
            break;

          case receiveMessageDeletedS2CActionWS:
            tryToRefetch(messagesRefetch);
            tryToRefetch(chatsRefetch); // update last message of the chat
            break;

          default:
            console.error('Unknown action to do:', lastJsonMessage.action);
            break;
        }
      }
    }
  }, [
    queryClient,
    lastJsonMessage,
    currentRouterUrl,
    navigate,
    state,
    userName,
    sendJsonMessage,
    currentChat,
    messagesRefetch,
    rightComponent,
    setRightComponent,
    setCurrentChat,
    chatsRefetch,
    friendsRefetch,
  ]);

  return <Toast ref={toast} />;
}

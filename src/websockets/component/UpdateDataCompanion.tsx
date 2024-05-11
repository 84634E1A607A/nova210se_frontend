import useWebSocket from 'react-use-websocket';
import { useEffect, useRef } from 'react';
import { assertIsS2CMessage } from '../AssertsWS';
import {
  receiveApplicationForChatS2CActionWS,
  receiveChatDeletedS2CActionWS,
  receiveFriendDeletedS2CActionWS,
  receiveMemberAddedS2CActionWS,
  receiveMemberRemovedS2CActionWS,
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
import { assertIsChatRelatedWithCurrentUser } from '../../utils/Asserts';
import { updateChatState } from '../../chat_control/states/updateChatState';
import { useUserName } from '../../utils/router/RouteParamsHooks';
import { getChatInfo } from '../../chat_control/getChatInfo';
import { getUserInfo } from '../../user_control/getUserInfo';
import { useCurrentChatContext } from '../../chat_control/states/CurrentChatProvider';
import { Toast } from 'primereact/toast';
import { useRefetchContext } from '../../chat_control/states/RefetchProvider';

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
  const { currentChat } = useCurrentChatContext();
  const { refetches } = useRefetchContext();

  useEffect(() => {
    /**
     * @description Deal with unauthorized chat. If current chat is unauthorized, jump to chats page. Else stay still
     * and only reload the data.
     * Unauthorized chat means the chat has been deleted or the user has been removed from the chat or a friend has been
     * deleted.
     * @param shouldDeleteCache Whether should `removeQueries({ queryKey: ['detailed_messages', String(chatId)] })` in
     * this function. If not, generally the caller should do it. And this should be true only if a friend is deleted (or
     * that user deletes account).
     * @param messageSummary The summary message to show in the toast
     * @param messageDetail The detail message to show in the toast
     */
    function dealChatUnauthorized(
      shouldDeleteCache: boolean,
      messageSummary: string,
      messageDetail: string,
    ) {
      //
      //   if (chat_detailUrlMatched || chat_mainUrlMatched) {
      //     let chatId: number;
      //     if (chat_detailUrlMatched) {
      //       chatId = Number(chat_detailUrlMatched[2]);
      //     } else {
      //       chatId = Number(chat_mainUrlMatched![2]);
      //     }
      //     getChatInfo({ chatId }).then((currentChat) => {
      //       if (currentChat === undefined) {
      //         if (shouldDeleteCache) {
      //           queryClient.removeQueries({ queryKey: ['detailed_messages', String(chatId)] });
      //         }
      //         navigate(`/${userName}/chats`);
      //         navigate(`/${userName}/chats`);
      //         toastRef.current!.show({
      //           severity: 'error',
      //           summary: messageSummary,
      //           detail: messageDetail,
      //         });
      //       } else if (shouldDeleteCache) {
      //         // delete all cache because we can't get chatId of the deleted private chat
      //         queryClient.removeQueries({ queryKey: ['detailed_messages'] });
      //       }
      //     });
      //   }
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
              navigate(currentRouterUrl, { replace: true, state });
            }
            break;

          case receiveMessageS2CActionWS:
            // Only in this case or when click the chat should we update the unread count of current user

            queryClient.removeQueries({
              queryKey: ['detailed_messages', String(lastJsonMessage.data.message.chat_id)],
            });

            // Mainly to update the last message of the chat.
            queryClient.removeQueries({ queryKey: ['chats_related_with_current_user'] });

            if (currentRouterUrl.match(chatsRouterUrl)) {
              if (currentChat?.chat_id === lastJsonMessage.data.message.chat_id) {
                // In exactly the page that needs changing: send 'I've read the messages' to server
                // (no need to update unread count because it's set to zero when enter the chat before)
                sendJsonMessage({
                  action: sendReadMessagesC2SActionWS,
                  data: { chat_id: lastJsonMessage.data.message.chat_id },
                });
              }
              navigate(currentRouterUrl, { preventScrollReset: true });
              console.log(refetches);
              refetches[0]();
            } else {
              // `state` is for possible invitations page
              navigate(currentRouterUrl, { preventScrollReset: true, state });
            }

            break;

          // case receiveMemberAddedS2CActionWS:
          //   queryClient.removeQueries({ queryKey: ['chats_related_with_current_user'] });
          //   if (
          //     currentRouterUrl.match(chatsRouterUrl) ||
          //     currentRouterUrl.match(chat_mainRouterUrl)
          //   ) {
          //     navigate(currentRouterUrl, { replace: true, preventScrollReset: true, state });
          //   } else if (currentRouterUrl.match(chat_detailRouterUrl)) {
          //     const chat = state.chat;
          //     assertIsChatRelatedWithCurrentUser(chat);
          //     updateChatState({
          //       chatId: chat.chat_id,
          //       toast: toastRef,
          //       navigate,
          //       userName,
          //     }).then((updatedChat) => {
          //       if (updatedChat) {
          //         navigate(currentRouterUrl, { replace: true, state: { chat: updatedChat } });
          //       } // else any problem will be dealt with within `updateChatState`
          //     });
          //   }
          //   break;

          case receiveFriendDeletedS2CActionWS:
            queryClient.removeQueries({ queryKey: ['chats_related_with_current_user'] });
            queryClient.removeQueries({ queryKey: ['friends'] });
            dealChatUnauthorized(
              true,
              'Friend deleted',
              'The friend has been deleted. No chat any more',
            );
            break;

          case receiveChatDeletedS2CActionWS:
            queryClient.removeQueries({ queryKey: ['chats_related_with_current_user'] });
            queryClient.removeQueries({
              queryKey: ['detailed_messages', String(lastJsonMessage.data.chat.chat_id)],
            });
            dealChatUnauthorized(false, 'Chat deleted', 'The chat has been deleted');
            break;

          case receiveMemberRemovedS2CActionWS:
            const deletedUserId = lastJsonMessage.data.user_id as number;
            getUserInfo().then((currentUser) => {
              if (currentUser?.id === deletedUserId) {
                queryClient.removeQueries({ queryKey: ['chats_related_with_current_user'] });
                queryClient.removeQueries({
                  queryKey: ['detailed_messages', String(lastJsonMessage.data.chat_id)],
                });
                dealChatUnauthorized(
                  false,
                  'You have been removed',
                  'You have been removed from the chat',
                );
              }
            });
            break;

          case receiveReadMessagesS2CActionWS:
            queryClient.removeQueries({
              queryKey: ['detailed_messages', String(lastJsonMessage.data.chat_id)],
            });
            if (currentRouterUrl.match(chatsRouterUrl)) {
              navigate(currentRouterUrl, { replace: true, state });
            }
            break;

          default:
            console.error('Unknown action to do:', lastJsonMessage.action);
            break;
        }
      }
    }
  }, [queryClient, lastJsonMessage, currentRouterUrl, navigate, state, userName, sendJsonMessage]);

  return <Toast ref={toast} />;
}

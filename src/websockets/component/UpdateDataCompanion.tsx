import useWebSocket from 'react-use-websocket';
import { useEffect, useRef } from 'react';
import { assertIsS2CMessage } from '../AssertsWS';
import {
  receiveApplicationForChatS2CActionWS,
  receiveFriendDeletedS2CActionWS,
  receiveMemberAddedS2CActionWS,
  receiveMessageS2CActionWS,
} from '../Actions';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  chat_detailRouterUrl,
  chat_mainRouterUrl,
  chatsRouterUrl,
  invitationsRouterUrl,
  loginRouterUrl,
} from '../../utils/consts/RouterPaths';
import { Message } from '../../utils/Types';
import { assertIsChatRelatedWithCurrentUser } from '../../utils/Asserts';
import { Toast } from 'primereact/toast';
import { updateChatState } from '../../chat_control/states/updateChatState';
import { useUserName } from '../../utils/UrlParamsHooks';
import { getChatInfo } from '../../chat_control/getChatInfo';

/**
 * @description If websocket message is received, remove the corresponding cache and re-navigate
 * to the desired page.
 */
export function UpdateDataCompanion() {
  const userName = useUserName();
  const queryClient = useQueryClient();

  const { lastJsonMessage } = useWebSocket(process.env.REACT_APP_WEBSOCKET_URL!, {
    share: true,
  });

  const location = useLocation();
  const thisPageUrl = location.pathname;
  const state = location.state;

  const navigate = useNavigate();

  const toast = useRef<Toast | null>(null);

  useEffect(() => {
    if (thisPageUrl.match(loginRouterUrl)) {
      return;
    }
    if (lastJsonMessage) {
      assertIsS2CMessage(lastJsonMessage);
      if (lastJsonMessage.ok) {
        if (lastJsonMessage.action === receiveApplicationForChatS2CActionWS) {
          queryClient.removeQueries({ queryKey: ['applications_for_chat'] });
          if (thisPageUrl.match(invitationsRouterUrl)) {
            navigate(thisPageUrl, { replace: true, state });
          }
        } else if (lastJsonMessage.action === receiveMessageS2CActionWS) {
          const message = lastJsonMessage.data.message as Message;

          /** Convert chatId to string is necessary. If not, the queryKey will not match correctly
           *  and the cache won't be erased correctly. */
          const chatId = String(message.chat_id);

          const matched = thisPageUrl.match(chat_mainRouterUrl);
          if (matched && matched[2] === chatId) {
            // In exactly the page that needs changing:
            queryClient.removeQueries({ queryKey: ['detailed_messages', chatId] });
            navigate(thisPageUrl, { replace: true, preventScrollReset: true, state });
          } else {
            queryClient.removeQueries({ queryKey: ['detailed_messages', chatId] });
          }
        } else if (lastJsonMessage.action === receiveMemberAddedS2CActionWS) {
          queryClient.removeQueries({ queryKey: ['chats_related_with_current_user'] });
          if (thisPageUrl.match(chatsRouterUrl) || thisPageUrl.match(chat_mainRouterUrl)) {
            navigate(thisPageUrl, { replace: true, preventScrollReset: true, state });
          } else if (thisPageUrl.match(chat_detailRouterUrl)) {
            const chat = state.chat;
            assertIsChatRelatedWithCurrentUser(chat);
            updateChatState({
              chatId: chat.chat_id,
              toast,
              navigate,
              userName,
            }).then((updatedChat) => {
              if (updatedChat) {
                navigate(thisPageUrl, { replace: true, state: { chat: updatedChat } });
              } // else any problem will be dealt with within `updateChatState`
            });
          }
        } else if (lastJsonMessage.action === receiveFriendDeletedS2CActionWS) {
          queryClient.removeQueries({ queryKey: ['chats_related_with_current_user'] });
          queryClient.removeQueries({ queryKey: ['friends'] });

          let shouldJumpToChats = true;
          const chat_detailUrlMatched = thisPageUrl.match(chat_detailRouterUrl);
          const chat_mainUrlMatched = thisPageUrl.match(chat_mainRouterUrl);
          if (!chat_detailUrlMatched && !chat_mainUrlMatched) {
            shouldJumpToChats = false;
          } else {
            let chatId: number;
            if (chat_detailUrlMatched) {
              chatId = Number(chat_detailUrlMatched[2]);
            } else {
              chatId = Number(chat_mainUrlMatched![2]);
            }
            getChatInfo({ chatId }).then((currentChat) => {
              if (currentChat === undefined) {
                shouldJumpToChats = true;
                queryClient.removeQueries({ queryKey: ['detailed_messages', String(chatId)] });
              }
            });
          }

          // !! if useEffect doesn't wait the above async function, then move the position of next block
          if (shouldJumpToChats) {
            toast.current?.show({
              severity: 'error',
              summary: 'Friend deleted',
              detail: 'The friend has been deleted. The chat does not exist!',
            });
            navigate(`/${userName}/chats`);
          } else {
            navigate(thisPageUrl, { replace: true, preventScrollReset: true, state });
          }
        } else {
          console.error('Unknown action:', lastJsonMessage.action);
        }
      }
    }
  }, [queryClient, lastJsonMessage, thisPageUrl, navigate, state, userName]);

  return (
    <>
      <Toast ref={toast} />
    </>
  );
}

import { Suspense, useEffect, useState } from 'react';
import { useLoaderData, Await, useNavigate, Navigate, useLocation } from 'react-router-dom';
import {
  assertIsChatsRelatedWithCurrentUser,
  assertIsDetailedMessages,
  assertIsFriendsList,
  assertIsLeastUserInfo,
} from '../../utils/Asserts';
import { SingleChatTab } from '../components/SingleChatTab';
import { parseChatName } from '../parseChatName';
import { useChatId, useUserName } from '../../utils/router/RouteParamsHooks';
import { useQueryClient } from '@tanstack/react-query';
import { ChatRelatedWithCurrentUser, LeastUserInfo } from '../../utils/Types';
// import { assertIsUserAndFriendsAndChatsRelatedWithCurrentUserAndDetailedMessagesData } from '../../utils/AssertsForRouterLoader';

/**
 * @description Includes the list of chats on the left, the main chat or chat detail on the right side.
 * Its loader needs: user, friends, chats_related_with_current_user, detailed_messages
 */
export function ChatMainPageFramework() {
  /**
   * @description The router path/url management part.
   */
  const userName = useUserName();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const currentRouterUrl = useLocation().pathname;
  const chatId = useChatId();

  /**
   * @description The state that manages which should be displayed on the right-hand side of this page.
   */
  const [rightComponent, setRightComponent] = useState<RightSideComponent>();

  /**
   * @description The data management part.
   */
  const { data } = useLoaderData() as any;

  /**
   * @description `parseChatName` may throw an error if a new friend is added and the friends list
   * is not updated to include the friend of the new private chat (when click chats page, chats may
   * load for the first time while friends is already loaded in other pages, so friends list may lag
   * behind chats list
   */
  const [shouldReload, setShouldReload] = useState(false);
  useEffect(() => {
    if (shouldReload) {
      queryClient.removeQueries({ queryKey: ['friends'] });
      navigate(currentRouterUrl, { replace: true, preventScrollReset: true });
      // must navigate, only setState won't be enough to trigger re-render or reload
      setShouldReload(false);
    }
    return () => setShouldReload(false);
  }, [navigate, queryClient, shouldReload, userName, setShouldReload]);

  return (
    <Suspense fallback={<p>Loading chats...</p>}>
      <Await resolve={data} errorElement={<Navigate to={currentRouterUrl} />}>
        {([currentUser, friends, chatsRelatedWithCurrentUser, detailedMessages]) => {
          assertIsLeastUserInfo(currentUser);
          assertIsFriendsList(friends);
          assertIsChatsRelatedWithCurrentUser(chatsRelatedWithCurrentUser);
          assertIsDetailedMessages(detailedMessages);

          /** @description get the chat name that can be directly displayed for a specific current user */
          chatsRelatedWithCurrentUser = chatsRelatedWithCurrentUser.map((chat) => {
            let chatName = '';
            try {
              chatName = parseChatName(chat, userName, friends);
            } catch (e) {
              setShouldReload(true);
            }
            return {
              ...chat,
              chatName,
            };
          });
          assertIsChatsRelatedWithCurrentUser(chatsRelatedWithCurrentUser);

          return (
            <div className="flex flex-grow flex-row">
              <div className="ml-2 flex w-1/5 max-w-72 flex-col">
                <ul>
                  {chatsRelatedWithCurrentUser.map((chat) => (
                    <li key={chat.chat_id}>
                      <SingleChatTab chat={chat} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* main page or chat detail page for chat apiece */}
              <div className="ml-2 w-4/5 flex-wrap border-r-2"></div>
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}

/**
 * @description The right side of the chat page can be chat or chat detail. If it's undefined, then no
 * single chat should be displayed.
 */
type RightSideComponent = 'chat' | 'more' | undefined;

import { Suspense } from 'react';
import { Await, Navigate, useLocation, useRouteLoaderData } from 'react-router-dom';
import { assertIsLeastUserInfo } from '../../utils/Asserts';
import { SingleChatTab } from '../components/SingleChatTab';
import { parseChatName } from '../parseChatName';
import { useUserName } from '../../utils/router/RouteParamsHooks';
import { useQuery } from '@tanstack/react-query';
import { SingleChatMain } from './SingleChatMain';
import { MoreOfChat } from './MoreOfChat';
import { useCurrentChatContext } from '../states/CurrentChatProvider';
import { assertIsUserData } from '../../utils/AssertsForRouterLoader';
import { getFriendsList } from '../../friend_control/getFriendsList';
import { useRefetchContext, useSetupRefetch } from '../states/RefetchProvider';
import { getChats } from '../getChats';
import { ChatRelatedWithCurrentUser } from '../../utils/Types';

/**
 * @description Includes the list of chats on the left, the main chat or chat detail on the right side.
 * Its loader needs: user, friends, chats_related_with_current_user, detailed_messages
 */
export function ChatMainPageFramework() {
  /**
   * @description The router path/url management part.
   */
  const userName = useUserName();
  const currentRouterUrl = useLocation().pathname;

  /**
   * @description The state that manages which should be displayed on the right-hand side of this page.
   */
  const { setCurrentChat, rightComponent, setRightComponent } = useCurrentChatContext();

  /**
   * @description The data management part.
   */
  const data = useRouteLoaderData('main_page'); // current 'user'
  assertIsUserData(data);

  const {
    isLoading: isLoadingChats,
    data: chats,
    refetch: refetchChats,
  } = useQuery({
    queryKey: ['chats_related_with_current_user'],
    queryFn: getChats,
  });

  const {
    isLoading: isLoadingFriends,
    data: friends,
    refetch: refetchFriends,
  } = useQuery({
    queryKey: ['friends'],
    queryFn: getFriendsList,
  });

  const { friendsRefetch, chatsRefetch } = useRefetchContext();
  useSetupRefetch(refetchChats, chatsRefetch);
  useSetupRefetch(refetchFriends, friendsRefetch);

  if (isLoadingChats || isLoadingFriends || chats === undefined || friends === undefined) {
    return <p>Loading chats...</p>;
  }

  /** @description get the chat name that can be directly displayed for a specific current user */
  const chatsRelatedWithCurrentUser = chats.map((chat) => {
    const chatName = parseChatName(chat, userName, friends);
    return {
      ...chat,
      chatName,
    } as ChatRelatedWithCurrentUser;
  });

  return (
    <Suspense fallback={<p>Loading current user info...</p>}>
      <Await resolve={data.user} errorElement={<Navigate to={currentRouterUrl} />}>
        {([currentUser]) => {
          assertIsLeastUserInfo(currentUser);

          return (
            <div className="flex flex-grow flex-row">
              <div className="ml-2 flex w-1/5 max-w-72 flex-col">
                <ul>
                  {chatsRelatedWithCurrentUser.map((chat) => (
                    <li
                      key={chat.chat_id}
                      onClick={() => {
                        setCurrentChat(chat);
                        setRightComponent('chat');
                      }}
                    >
                      <SingleChatTab chat={chat} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* main page or chat detail page for chat apiece */}
              <div className="ml-2 w-4/5 flex-wrap border-r-2">
                {rightComponent === 'chat' ? (
                  <SingleChatMain
                    setRightComponent={setRightComponent}
                    user={currentUser}
                    friends={friends}
                  />
                ) : rightComponent === 'more' ? (
                  <MoreOfChat
                    user={currentUser}
                    friends={friends}
                    setRightComponent={setRightComponent}
                  />
                ) : null}
              </div>
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}

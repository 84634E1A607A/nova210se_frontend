import { SingleChatTab } from '../components/SingleChatTab';
import { parseChatName } from '../parseChatName';
import { useUserName } from '../../utils/router/RouteParamsHooks';
import { useQuery } from '@tanstack/react-query';
import { SingleChatMain } from './SingleChatMain';
import { MoreOfChat } from './MoreOfChat';
import { useCurrentChatContext } from '../states/CurrentChatProvider';
import { getFriendsList } from '../../friend_control/getFriendsList';
import { useRefetchContext, useSetupRefetch } from '../states/RefetchProvider';
import { getChats } from '../getChats';
import { ChatRelatedWithCurrentUser } from '../../utils/Types';
import { getUserInfo } from '../../user_control/getUserInfo';

/**
 * @description Includes the list of chats on the left, the main chat or chat detail on the right side.
 * Its loader needs: user, friends, chats_related_with_current_user, detailed_messages
 */
export function ChatMainPageFramework() {
  /**
   * @description The router path/url management part.
   */
  const userName = useUserName();

  /**
   * @description The state that manages which should be displayed on the right-hand side of this page.
   */
  const { setCurrentChat, rightComponent, setRightComponent } = useCurrentChatContext();

  /**
   * @description The data management part.
   */
  const { isLoading: isLoadingUser, data: currentUser } = useQuery({
    queryKey: ['user'],
    queryFn: getUserInfo,
  });

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

  if (
    isLoadingChats ||
    isLoadingFriends ||
    isLoadingUser ||
    chats === undefined ||
    friends === undefined ||
    currentUser === undefined
  ) {
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
          <SingleChatMain user={currentUser} friends={friends} />
        ) : rightComponent === 'more' ? (
          <MoreOfChat user={currentUser} friends={friends} setRightComponent={setRightComponent} />
        ) : null}
      </div>
    </div>
  );
}

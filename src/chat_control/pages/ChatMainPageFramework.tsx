import { useUserName } from '../../utils/router/RouteParamsHooks';
import { useQuery } from '@tanstack/react-query';
import { SingleChatMain } from './SingleChatMain';
import { MoreOfChat } from './MoreOfChat';
import { useCurrentChatContext } from '../states/CurrentChatProvider';
import { ChatSideBar } from './ChatSideBar';
import { ChatRelatedWithCurrentUser } from '../../utils/Types';
import { useRefetchContext, useSetupRefetch } from '../states/RefetchProvider';
import { getUserInfo } from '../../user_control/getUserInfo';
import { getChats } from '../getChats';
import { getFriendsList } from '../../friend_control/getFriendsList';
import { parseChatName } from '../../utils/parseChatName';

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
    <div className="flex max-h-screen flex-grow flex-row">
      <ChatSideBar
        chatsRelatedWithCurrentUser={chatsRelatedWithCurrentUser}
        setCurrentChat={setCurrentChat}
        setRightComponent={setRightComponent}
      />

      <div className="h-full w-[3px] border-b-4 border-l bg-gray-300"></div>

      {/* main page or chat detail page for chat apiece */}
      <div className="ml-2 flex max-h-screen w-5/6 justify-center border-r-2">
        {rightComponent === 'chat' ? (
          <SingleChatMain user={currentUser} friends={friends} />
        ) : rightComponent === 'more' ? (
          <MoreOfChat user={currentUser} friends={friends} setRightComponent={setRightComponent} />
        ) : null}
      </div>
    </div>
  );
}

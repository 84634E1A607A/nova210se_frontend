import { Suspense } from 'react';
import { useLoaderData, Outlet, Await, useOutletContext } from 'react-router-dom';
import { assertIsFriendsAndChatsRelatedWithCurrentUserData } from '../../utils/AssertsForRouterLoader';
import { assertIsChatsRelatedWithCurrentUser, assertIsFriendsList } from '../../utils/Asserts';
import { SingleChatTab } from './SingleChatTab';
import { parseChatName } from '../parseChatName';
import { useUserName } from '../../utils/UrlParamsHooks';
import { ChatRelatedWithCurrentUser, Friend } from '../../utils/types';

export function ChatMainPageFramework() {
  const friendsAndChatsRelatedWithCurrentUserData = useLoaderData();
  assertIsFriendsAndChatsRelatedWithCurrentUserData(friendsAndChatsRelatedWithCurrentUserData);
  const userName = useUserName();

  return (
    <Suspense fallback={<p>Loading chats...</p>}>
      <Await resolve={friendsAndChatsRelatedWithCurrentUserData.chatsRelatedWithCurrentUser}>
        {(chatsRelatedWithCurrentUser) => (
          <Await resolve={friendsAndChatsRelatedWithCurrentUserData.friends}>
            {(friends) => {
              assertIsChatsRelatedWithCurrentUser(chatsRelatedWithCurrentUser);
              assertIsFriendsList(friends);
              chatsRelatedWithCurrentUser = chatsRelatedWithCurrentUser.map((chat) => {
                return {
                  ...chat,
                  chatName: parseChatName(chat, userName, friends),
                };
              });
              assertIsChatsRelatedWithCurrentUser(chatsRelatedWithCurrentUser);
              return (
                <div className="flex flex-row flex-grow">
                  <div className="flex flex-col w-1/5 max-w-72 ml-2">
                    <ul>
                      {chatsRelatedWithCurrentUser.map((chat) => (
                        <li key={chat.chat_id}>
                          <SingleChatTab chat={chat} />
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* main page for chat apiece */}
                  <div className="ml-2 border-r-2 w-4/5 felx-wrap">
                    <Outlet
                      context={
                        {
                          chatsRelatedWithCurrentUser,
                        } satisfies ChatsRelatedContextType
                      }
                    />
                  </div>
                </div>
              );
            }}
          </Await>
        )}
      </Await>
    </Suspense>
  );
}

interface ChatsRelatedContextType {
  chatsRelatedWithCurrentUser: ChatRelatedWithCurrentUser[];
  friends?: Friend[];
}

export function useChatsRelatedContext() {
  return useOutletContext<ChatsRelatedContextType>();
}

import { Suspense } from 'react';
import { useLoaderData, Outlet, Await, useOutletContext, useNavigate } from 'react-router-dom';
import { assertIsFriendsAndChatsRelatedWithCurrentUserData } from '../../utils/AssertsForRouterLoader';
import { assertIsChatsRelatedWithCurrentUser, assertIsFriendsList } from '../../utils/Asserts';
import { SingleChatTab } from './SingleChatTab';
import { parseChatName } from '../parseChatName';
import { useUserName } from '../../utils/UrlParamsHooks';
import { ChatRelatedWithCurrentUser, Friend } from '../../utils/Types';
import { useQueryClient } from '@tanstack/react-query';

export function ChatMainPageFramework() {
  const friendsAndChatsRelatedWithCurrentUserData = useLoaderData();
  assertIsFriendsAndChatsRelatedWithCurrentUserData(friendsAndChatsRelatedWithCurrentUserData);
  const userName = useUserName();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return (
    <Suspense fallback={<p>Loading chats...</p>}>
      <Await resolve={friendsAndChatsRelatedWithCurrentUserData.chatsRelatedWithCurrentUser}>
        {(chatsRelatedWithCurrentUser) => (
          <Await resolve={friendsAndChatsRelatedWithCurrentUserData.friends}>
            {(friends) => {
              assertIsChatsRelatedWithCurrentUser(chatsRelatedWithCurrentUser);
              assertIsFriendsList(friends);

              chatsRelatedWithCurrentUser = chatsRelatedWithCurrentUser.map((chat) => {
                let chatName: string = chat.chat.chat_name;
                try {
                  // `parseChatName` may throw an error if a new friend is added and the friends list
                  // is not reloaded, so when parse a private chat's name, it can't find the friend.
                  chatName = parseChatName(chat, userName, friends);
                } catch (e) {
                  queryClient.removeQueries({ queryKey: ['friends'] });
                  navigate(`/${userName}/chats`);
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

                  {/* main page for chat apiece */}
                  <div className="felx-wrap ml-2 w-4/5 border-r-2">
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

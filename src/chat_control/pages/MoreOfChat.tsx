import { Await, useLoaderData, useLocation } from 'react-router-dom';
import {
  assertIsChatRelatedWithCurrentUser,
  assertIsFriendsList,
  assertIsLeastUserInfo,
} from '../../utils/asserts';
import { SingleUserTab } from '../components/SIngleUserTab';
import { Suspense } from 'react';
import { assertIsUserAndFriendsData } from '../../utils/queryRouterLoaderAsserts';
import { LeastUserInfo } from '../../utils/types';

/**
 * @description the members and settings, etc. of a chat
 */
export function MoreOfChat() {
  const location = useLocation();
  const state = location.state; // States will not be erased when refresh the browser. I don't know why.
  const chat = state.chat;
  assertIsChatRelatedWithCurrentUser(chat);

  const isPrivateChat = chat.chat.chat_name === '';

  const userAndFriendsLoaderData = useLoaderData();
  assertIsUserAndFriendsData(userAndFriendsLoaderData);

  return (
    <div className="flex flex-col">
      {/** two types of name, one is absolute name, which can be set by admins. Nickname can be arbitrarily set */}
      <span className="p-1">
        {`${isPrivateChat ? 'Private' : 'Group'} chat name: ${chat.chatName}`}
      </span>
      {isPrivateChat ? null : (
        <span className="p-1">{`Absolute name: ${chat.chat.chat_name}`}</span>
      )}

      <Suspense>
        <Await resolve={userAndFriendsLoaderData.user}>
          {(currentUser) => {
            return (
              <Await resolve={userAndFriendsLoaderData.friends}>
                {(friends) => {
                  assertIsLeastUserInfo(currentUser);
                  assertIsFriendsList(friends);
                  const otherMembers = chat.chat.chat_members.filter(
                    (member) => member.id !== currentUser.id,
                  );
                  otherMembers.forEach((member, index) => {
                    const friend = friends.find((friend) => friend.friend.id === member.id);
                    if (friend) {
                      otherMembers[index].user_name =
                        friend.nickname === '' ? friend.friend.user_name : friend.nickname;
                    }
                  });
                  return (
                    <div>
                      {isPrivateChat ? (
                        <SingleUserTab user={otherMembers[0] as LeastUserInfo} />
                      ) : (
                        <div>ul of members</div>
                      )}
                    </div>
                  );
                }}
              </Await>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

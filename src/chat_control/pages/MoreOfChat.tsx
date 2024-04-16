import { Await, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import {
  assertIsChatRelatedWithCurrentUser,
  assertIsFriendsList,
  assertIsLeastUserInfo,
} from '../../utils/asserts';
import { SingleUserTab } from '../components/SIngleUserTab';
import { Suspense, useRef, useState } from 'react';
import { assertIsUserAndFriendsData } from '../../utils/queryRouterLoaderAsserts';
import { ContextMenu } from 'primereact/contextmenu';
import { LeastUserInfo } from '../../utils/types';
import { Toast } from 'primereact/toast';
import { useUserName } from '../../utils/UrlParamsHooks';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setAdmin } from '../setAdmin';
import { getChatInfo } from '../getChatInfo';

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

  const navigate = useNavigate();
  const userName = useUserName();
  const queryClient = useQueryClient();

  const { mutate: toggleAdmin } = useMutation({
    mutationFn: setAdmin,
    onSuccess: async ({ isSuccessful }) => {
      if (isSuccessful) {
        queryClient.removeQueries({ queryKey: ['chats_related_with_current_user'] }); // prevent too-complicated cache setting
        const newChat = await getChatInfo({ chatId: chat.chat_id });
        if (!newChat) {
          navigate(`/${userName}`);
          window.alert('Error in getting chat info');
          return;
        }
        navigate(`/${userName}/chats/${chat.chat_id}/more`, { state: { chat: newChat } });
        window.alert('Successfully toggle admin');
      } else window.alert('Failed to toggle admin');
    },
  });

  const cm = useRef<ContextMenu | null>(null);
  const [selectedMember, setSelectedMember] = useState<DetailedMemberInfo | undefined>();
  const toast = useRef<Toast | null>(null);
  const currentUserRef = useRef<LeastUserInfo | undefined>();

  const inviteFriendContextMenuItem = {
    label: 'Invite',
    icon: 'pi pi-facebook',
    command: () => {
      if (selectedMember!.isFriend || selectedMember!.isMe)
        toast.current?.show({
          severity: 'error',
          summary: 'Failed',
          detail: selectedMember!.isFriend ? "Can't invite a friend" : "Can't invite yourself",
          life: 2000,
        });
      else
        navigate(`/${userName}/invite`, {
          state: { source: chat.chat_id, id: selectedMember!.id },
        });
    },
  };

  const setAdminContextMenuItem = {
    label: 'Toggle Admin',
    command: () => {
      const currentUserIsOwner = chat.chat.chat_owner.id === currentUserRef.current!.id;
      const currentUserIsAdmin =
        chat.chat.chat_admins.find((admin) => admin.id === currentUserRef.current!.id) !==
        undefined;
      let isAbleToToggle = false;
      let errorDetail = '';
      if (!currentUserIsOwner && !currentUserIsAdmin) {
        errorDetail = 'You are neither an admin nor the owner';
      }
      if (selectedMember!.isAdmin && !currentUserIsOwner && !selectedMember?.isMe) {
        errorDetail = 'Only the owner or yourself can remove an admin';
      }
      if (selectedMember!.isOwner) {
        errorDetail = 'You cannot change the owner hold using admin setting button';
      }
      if (errorDetail === '') {
        isAbleToToggle = true;
      }
      if (isAbleToToggle) {
        toggleAdmin({
          chatId: chat.chat_id,
          memberId: selectedMember!.id,
          setToAdmin: !selectedMember!.isAdmin,
        });
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Failed',
          detail: errorDetail,
          life: 2000,
        });
        return;
      }
    },
  };

  const transferOwnerContextMenuItem = {
    label: 'Transfer Owner',
    command: () => {
      // TODO
      console.log('transfer owner');
    },
  };

  const removeMemberContextMenuItem = {
    label: 'Remove Member',
    command: () => {
      // TODO
      console.log('remove member');
    },
  };

  const roleManagementItems = [
    setAdminContextMenuItem,
    transferOwnerContextMenuItem,
    removeMemberContextMenuItem,
  ];

  const contextMenuItems = [
    {
      label: 'Roles',
      icon: 'pi pi-users',
      items: roleManagementItems,
    },
    inviteFriendContextMenuItem,
  ];

  const onRightClick = (
    event: React.MouseEvent,
    member: DetailedMemberInfo,
    currentUser: LeastUserInfo,
  ) => {
    if (cm.current) {
      setSelectedMember(member);
      cm.current.show(event);
      currentUserRef.current = currentUser;
    }
  };

  return (
    <div className="flex flex-col ml-3">
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
                  // parse the name to display for each user
                  const membersToDisplay = !isPrivateChat
                    ? chat.chat.chat_members
                    : chat.chat.chat_members.filter((member) => member.id !== currentUser.id);
                  membersToDisplay.forEach((member, index) => {
                    const friend = friends.find((friend) => friend.friend.id === member.id);
                    if (friend) {
                      membersToDisplay[index].user_name =
                        friend.nickname === '' ? friend.friend.user_name : friend.nickname;
                    }
                  });
                  return (
                    <div className="card flex md:justify-content-center">
                      <ul className="m-0 p-0 list-none border-1 surface-border border-round flex flex-column gap-2 w-full md:w-30rem">
                        {membersToDisplay.map((member) => {
                          const detailedMember: DetailedMemberInfo = {
                            ...member,
                            isOwner: chat.chat.chat_owner.id === member.id,
                            isAdmin: chat.chat.chat_admins.some((admin) => admin.id === member.id),
                            isMe: currentUser.id === member.id,
                            isFriend: friends.some((friend) => friend.friend.id === member.id),
                          };

                          // some of the following classNames are from primeflex, not tailwind, don't delete them unless
                          // you transform some of them to tailwind to make the code more consistent
                          return (
                            <li
                              key={detailedMember.id}
                              onContextMenu={(event) =>
                                onRightClick(event, detailedMember, currentUser)
                              }
                              className={`p-2 hover:surface-hover border-round border-1 border-transparent transition-all transition-duration-200 
                              flex align-items-center justify-content-between ${selectedMember?.id === detailedMember.id && 'border-primary'}`}
                            >
                              <SingleUserTab user={detailedMember} />
                            </li>
                          );
                        })}
                      </ul>
                      <ContextMenu
                        ref={cm}
                        model={contextMenuItems}
                        onHide={() => {
                          setSelectedMember(undefined);
                        }}
                      />
                    </div>
                  );
                }}
              </Await>
            );
          }}
        </Await>
      </Suspense>
      <Toast ref={toast} />
    </div>
  );
}

export type DetailedMemberInfo = LeastUserInfo & {
  isOwner: boolean;
  isAdmin: boolean;
  isMe: boolean;
  isFriend: boolean;
};

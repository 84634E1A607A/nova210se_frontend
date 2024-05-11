import { useNavigate } from 'react-router-dom';
import { SingleUserTab } from '../components/SIngleUserTab';
import { useRef, useState } from 'react';
import { ContextMenu } from 'primereact/contextmenu';
import { DetailedUserInfo, Friend, LeastUserInfo } from '../../utils/Types';
import { Toast } from 'primereact/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setAdmin } from '../setAdmin';
import { transferOwner } from '../transferOwner';
import { kickoutMember } from '../kickoutMember';
import { leaveChat } from '../leaveChat';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';
import { deleteChat } from '../deleteChat';
import { InviteFriendIntoChat } from '../components/InviteFriendIntoChat';
import { getInvitableFriends } from '../utils/getInvitableFriends';
import { updateChatState } from '../states/updateChatState';
import { MouseEvent } from 'react';
import { MessagesFilterContainer } from '../components/MessagesFilterContainer';
import { parseNameOfFriend } from '../../friend_control/utils/parseNameOfFirend';
import { useCurrentChatContext } from '../states/CurrentChatProvider';

/**
 * @description the members and settings, etc. of a chat
 */
export function MoreOfChat({ user, friends, setRightComponent }: Props) {
  const { currentChat } = useCurrentChatContext();
  if (currentChat === null) throw new Error('currentChat is null');

  const currentUserIsOwner = currentChat.chat.chat_owner.id === user.id;
  const currentUserIsAdmin =
    currentChat.chat.chat_admins.find((admin) => admin.id === user.id) !== undefined;
  const isPrivateChat = currentChat.chat.chat_name === '';

  const membersForUse = !isPrivateChat
    ? currentChat.chat.chat_members
    : currentChat.chat.chat_members.filter((member) => member.id !== user.id);
  const membersToDisplay: DetailedUserInfo[] = membersForUse.map((member) => {
    const friend = friends.find((item) => item.friend.id === member.id);
    if (friend)
      return {
        ...member,
        nickname: parseNameOfFriend(friend),
      };
    else
      return {
        ...member,
        nickname: member.user_name,
      };
  });
  const membersWithoutSelf = currentChat.chat.chat_members.filter(
    (member) => member.id !== user.id,
  );

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /**
   * @description Function called for `onSuccess` in `useMutation`, for the components in which
   * when the mutation is successful, the page will be redirected to the parent page, not staying
   * in the current page.
   */
  const onMutateSuccessToParentPage = (
    isSuccessful: boolean,
    _successMessage: string,
    failedMessage: string,
  ) => {
    if (isSuccessful) {
      queryClient.removeQueries({ queryKey: ['chats_related_with_current_user'] });
      navigate(`/${user.user_name}/chats`); // without it time is so short, and the loader won't reload. don't know why
      navigate(`/${user.user_name}/chats`);
      setRightComponent(undefined);
      // toast is called by websocket part in `UpdateDataCompanion`
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Failed',
        detail: failedMessage,
        life: 2000,
      });
    }
  };

  /**
   * @description Function called for `onSuccess` in `useMutation`, for the components in which
   * when the mutation is successful, the page will be reloaded in the current page.
   */
  const onMutateSuccessStayStill = async (
    isSuccessful: boolean,
    successMessage: string,
    failedMessage: string,
  ) => {
    if (isSuccessful) {
      // prevent too-complicated cache setting
      queryClient.removeQueries({ queryKey: ['chats_related_with_current_user'] });
      const updatedChat = await updateChatState({
        chatId: currentChat.chat_id,
        toast,
        navigate: navigate,
        userName: user.user_name,
      });
      if (!updatedChat) return;
      navigate(`/${user.user_name}/chats/${currentChat.chat_id}/more`, {
        state: { chat: updatedChat },
      });
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: successMessage,
        life: 1500,
      });
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Failed',
        detail: failedMessage,
        life: 2000,
      });
    }
  };

  const { mutate: mutateAdmin } = useMutation({
    mutationFn: setAdmin,
    onSuccess: async ({ isSuccessful }) => {
      await onMutateSuccessStayStill(
        isSuccessful,
        'Successfully changed admin state',
        'Failed to change admin state',
      );
    },
  });

  const { mutate: mutateOwner } = useMutation({
    mutationFn: transferOwner,
    onSuccess: async ({ isSuccessful }) => {
      await onMutateSuccessStayStill(
        isSuccessful,
        'Successfully transferred owner',
        'Failed to transfer owner',
      );
    },
  });

  const { mutate: mutateKickoutMember } = useMutation({
    mutationFn: kickoutMember,
    onSuccess: async ({ isSuccessful }) => {
      await onMutateSuccessStayStill(
        isSuccessful,
        'Successfully kicked out member',
        'Failed to kick out member',
      );
    },
  });

  const { mutate: mutateLeaveChat } = useMutation({
    mutationFn: leaveChat,
    onSuccess: ({ isSuccessful }) => {
      onMutateSuccessToParentPage(isSuccessful, 'Successfully left chat', 'Failed to leave chat');
    },
  });

  const cm = useRef<ContextMenu | null>(null);
  const [selectedMember, setSelectedMember] = useState<DetailedMemberInfo | undefined>();
  const toast = useRef<Toast | null>(null);

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
      else {
        navigate(`/${user.user_name}/invite`, {
          state: { source: currentChat.chat_id, id: selectedMember!.id },
        });
      }
    },
  };

  const setAdminContextMenuItem = {
    label: 'Toggle Admin',
    command: () => {
      let isAbleToToggle = false;
      let errorDetail = '';
      if (selectedMember!.isMe) {
        errorDetail = 'You cannot change your own admin state';
      }
      if (!currentUserIsOwner) {
        errorDetail = 'Only an owner can toggle admin';
      }
      if (errorDetail === '') {
        isAbleToToggle = true;
      }
      if (isAbleToToggle) {
        mutateAdmin({
          chatId: currentChat.chat_id,
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
      if (currentUserIsOwner && !selectedMember!.isMe) {
        mutateOwner({ chatId: currentChat.chat_id, newOwnerId: selectedMember!.id });
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Failed',
          detail: selectedMember!.isMe
            ? 'You cannot transfer owner to yourself'
            : 'You are not the owner',
          life: 2000,
        });
      }
    },
  };

  const removeMemberContextMenuItem = {
    label: 'Remove Member',
    command: () => {
      if (selectedMember!.isMe && !selectedMember!.isOwner) {
        mutateLeaveChat({ chatId: currentChat.chat_id });
      } else if (selectedMember!.isOwner) {
        toast.current?.show({
          severity: 'error',
          summary: 'Failed',
          detail: 'You cannot remove the owner',
          life: 2000,
        });
      } else if (selectedMember!.isAdmin && !currentUserIsOwner) {
        toast.current?.show({
          severity: 'error',
          summary: 'Failed',
          detail: 'Only the owner can remove an admin',
          life: 2000,
        });
      } else if (!currentUserIsAdmin && !currentUserIsOwner) {
        toast.current?.show({
          severity: 'error',
          summary: 'Failed',
          detail: 'You are not an admin',
          life: 2000,
        });
      } else {
        mutateKickoutMember({ chatId: currentChat.chat_id, memberId: selectedMember!.id });
      }
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

  /**
   * @description When right-click on a member of a group chat, show the context menu
   */
  const onRightClick = (event: MouseEvent, member: DetailedMemberInfo) => {
    if (cm.current) {
      setSelectedMember(member);
      cm.current.show(event);
    }
  };

  const { mutate: acceptDeleteChat } = useMutation({
    mutationFn: deleteChat,
    onSuccess: ({ isSuccessful }) => {
      onMutateSuccessToParentPage(
        isSuccessful,
        'Successfully deleted chat',
        'Failed to delete chat',
      );
    },
  });

  const confirmDeleteChat = (chatId: number) => {
    confirmDialog({
      message: 'Are you sure you want to delete the chat?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      acceptClassName: 'ml-4 p-button-danger ',
      accept: () => acceptDeleteChat(chatId),
      reject: () => {
        toast.current?.show({
          severity: 'info',
          summary: 'Rejected',
          detail: 'You have cancelled the deletion',
          life: 2000,
        });
      },
    });
  };

  return (
    <div className="ml-3 flex flex-col">
      {/** two types of name, one is absolute name, which can be set by admins. Nickname can be arbitrarily set */}
      <span className="p-1">
        {`${isPrivateChat ? 'Private' : 'Group'} chat name: ${currentChat.chatName}`}
      </span>
      {isPrivateChat ? null : (
        <span className="p-1">{`Absolute name: ${currentChat.chat.chat_name}`}</span>
      )}

      <div className="card md:justify-content-center flex flex-col items-center">
        <ul className="border-1 surface-border border-round flex-column md:w-30rem m-0 flex w-full list-none gap-2 p-0">
          {membersToDisplay.map((member) => {
            const detailedMember: DetailedMemberInfo = {
              ...member,
              isOwner: currentChat.chat.chat_owner.id === member.id,
              isAdmin: currentChat.chat.chat_admins.some((admin) => admin.id === member.id),
              isMe: user.id === member.id,
              isFriend: friends.some((friend) => friend.friend.id === member.id),
            };

            return (
              <li
                key={detailedMember.id}
                onContextMenu={(event) => onRightClick(event, detailedMember)}
                className={`hover:surface-hover border-round border-1 transition-duration-200 align-items-center justify-content-between flex 
                    border-transparent p-2 transition-all ${selectedMember?.id === detailedMember.id && 'border-primary'}`}
              >
                <SingleUserTab user={detailedMember} isPrivateChat={isPrivateChat} />
              </li>
            );
          })}
        </ul>
        {isPrivateChat ? null : (
          <ContextMenu
            ref={cm}
            model={contextMenuItems}
            onHide={() => {
              setSelectedMember(undefined);
            }}
          />
        )}

        <ConfirmDialog />
        {currentChat.chat.chat_owner.id === user.id && !isPrivateChat ? (
          <div className="card justify-content-center flex flex-wrap gap-2">
            <Button
              onClick={() => confirmDeleteChat(currentChat.chat_id)}
              icon="pi pi-check"
              label="Delete chat"
              className="mr-2"
            />
          </div>
        ) : null}

        {isPrivateChat ? null : (
          <InviteFriendIntoChat
            toast={toast}
            invitableFriends={getInvitableFriends({ friends, membersWithoutSelf })}
          />
        )}

        <MessagesFilterContainer
          chat={currentChat}
          currentUser={user}
          membersWithDisplayName={membersToDisplay}
        />
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export type DetailedMemberInfo = DetailedUserInfo & {
  isOwner: boolean;
  isAdmin: boolean;
  isMe: boolean;
  isFriend: boolean;
};

interface Props {
  user: LeastUserInfo;
  friends: Friend[];
  setRightComponent: any;
}

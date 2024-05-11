import { Await, Navigate, useLoaderData, useNavigate } from 'react-router-dom';
import { Suspense } from 'react';
import { assertIsInvitationsAndApplicationsForChatAndChatsRelatedWithCurrentUserData } from '../utils/AssertsForRouterLoader';
import {
  assertIsApplicationsForChat,
  assertIsChatsRelatedWithCurrentUser,
  assertIsInvitationList,
} from '../utils/Asserts';
import { acceptInvitation } from './acceptInvitation';
import { rejectInvitation } from './rejectInvitation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Invitation } from '../utils/Types';
import { useUserName } from '../utils/router/RouteParamsHooks';
import { theme } from '../utils/ui/themes';
import { UserDisplayTabInInvitations } from './UserDisplayTabInInvitations';
import { ApplicationsForChatList } from '../chat_control/components/ApplicationsForChatList';

/**
 * @description Friend applications and applications for entering group chat if the current
 * user is admin or owner.
 */
export function OngoingInvitations() {
  const navigate = useNavigate();
  const userName = useUserName();
  const thisPageUrl = `/${userName}/invitation_list`;

  const handleAccept = async (invitationId: number) => {
    return await acceptInvitation(invitationId);
  };

  const handleReject = async (invitationId: number) => {
    return await rejectInvitation(invitationId);
  };

  const queryClient = useQueryClient();
  const { mutate: accept, variables: acceptVar } = useMutation({
    mutationFn: handleAccept,
    onSuccess: (friend) => {
      if (friend === undefined) return;
      queryClient.removeQueries({ queryKey: ['friends'] });
      queryClient.removeQueries({ queryKey: ['chats_related_with_current_user'] });
      queryClient.setQueryData<Invitation[]>(['invitations'], (oldInvitations) => {
        return oldInvitations?.filter((invitation) => invitation.id !== acceptVar);
      });
      navigate(thisPageUrl);
    },
  });
  const { mutate: reject, variables: rejectVar } = useMutation({
    mutationFn: handleReject,
    onSuccess: (rejectSuccessful) => {
      if (!rejectSuccessful) return;
      queryClient.setQueryData<Invitation[]>(['invitations'], (oldInvitations) => {
        return oldInvitations?.filter((invitation) => invitation.id !== rejectVar);
      });
      navigate(thisPageUrl);
    },
  });

  const data = useLoaderData();
  assertIsInvitationsAndApplicationsForChatAndChatsRelatedWithCurrentUserData(data);

  return (
    <Suspense fallback={<div>Loading invitations...</div>}>
      <Await resolve={data.invitations} errorElement={<Navigate to={thisPageUrl} replace={true} />}>
        {(invitations) => {
          assertIsInvitationList(invitations);
          return (
            <Await
              resolve={data.applicationsForChat}
              errorElement={<Navigate to={thisPageUrl} replace={true} />}
            >
              {(applicationsForChat) => {
                assertIsApplicationsForChat(applicationsForChat);
                return (
                  <Await
                    resolve={data.chatsRelatedWithCurrentUser}
                    errorElement={<Navigate to={thisPageUrl} replace={true} />}
                  >
                    {(chats) => {
                      assertIsChatsRelatedWithCurrentUser(chats);
                      return (
                        <div className="flex flex-grow flex-col">
                          <strong className="m-2">Applications for friendship</strong>
                          <ul>
                            {invitations.map((invitation) => (
                              <li key={invitation.id}>
                                <div
                                  className="m-1 p-2"
                                  style={{ backgroundColor: theme.secondary_container }}
                                >
                                  <p className="m-1">
                                    From{' '}
                                    {invitation.source === 'search'
                                      ? ' search'
                                      : ` group with id: ${invitation.source}`}
                                  </p>
                                  {invitation.comment === '' ? null : (
                                    <p className="m-2">Invitation message: {invitation.comment}</p>
                                  )}
                                  <UserDisplayTabInInvitations leastUserInfo={invitation.sender} />
                                  <div className="flex flex-row place-content-evenly place-items-center">
                                    <button
                                      type="button"
                                      onClick={() => accept(invitation.id)}
                                      className="text-green-600"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => reject(invitation.id)}
                                      className="text-red-600"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>

                          <strong className="m-2">Applications for chat</strong>
                          <ApplicationsForChatList
                            applications={applicationsForChat}
                            chats={chats}
                          />
                        </div>
                      );
                    }}
                  </Await>
                );
              }}
            </Await>
          );
        }}
      </Await>
    </Suspense>
  );
}

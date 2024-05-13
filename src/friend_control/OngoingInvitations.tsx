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
import { ApplicationsForChatList } from '../chat_control/components/ApplicationsForChatList';
import { Avatar } from '../utils/ui/Avatar';
import { ScrollPanel } from 'primereact/scrollpanel';

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
                        <div className="flex grow flex-col">
                          <div className="flex min-h-2 grow" />
                          <div className="surface-0 mx-auto box-border flex h-[40%] min-w-[80%] flex-col rounded-lg p-4 shadow-md">
                            <div className="text-900 mb-4 text-3xl font-medium">
                              Applications for friendship
                            </div>
                            {invitations.length === 0 ? (
                              <div className="text-gray-500">No applications</div>
                            ) : (
                              <ScrollPanel className="grow overflow-clip">
                                <ul>
                                  {invitations.map((invitation) => (
                                    <li key={invitation.id}>
                                      <div className="m-1 flex flex-row rounded-lg bg-blue-50 px-4 py-2">
                                        <div className="my-auto flex h-14 w-14">
                                          <Avatar url={invitation.sender.avatar_url} />
                                        </div>

                                        <div className="flex grow flex-col px-4 text-left">
                                          <div className="m-1">
                                            <span className="font-bold">Source: </span>
                                            {invitation.source === 'search'
                                              ? 'Search'
                                              : `Group with id: ${invitation.source}`}
                                          </div>

                                          <div className="m-1">
                                            <span className="font-bold">Message: </span>
                                            {invitation.comment === '' ? (
                                              <span className="italic">Not Provided</span>
                                            ) : (
                                              invitation.comment
                                            )}
                                          </div>
                                          <div className="m-1">
                                            <span className="font-bold">Username: </span>
                                            <span>{invitation.sender.user_name}</span>
                                          </div>
                                        </div>

                                        <div className="flex flex-col">
                                          <button
                                            type="button"
                                            onClick={() => accept(invitation.id)}
                                            className="focus:shadow-outline my-1 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                          >
                                            Accept
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => reject(invitation.id)}
                                            className="focus:shadow-outline my-1 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                          >
                                            Reject
                                          </button>
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </ScrollPanel>
                            )}
                          </div>
                          <div className="flex min-h-2 grow" />
                          <div className="surface-0 mx-auto box-border flex h-[40%] min-w-[80%] flex-col rounded-lg p-4 shadow-md">
                            <div className="text-900 mb-4 text-3xl font-medium">
                              Applications for chat
                            </div>
                            {applicationsForChat.length === 0 ? (
                              <div className="text-gray-500">No applications</div>
                            ) : (
                              <ApplicationsForChatList
                                applications={applicationsForChat}
                                chats={chats}
                              />
                            )}
                          </div>
                          <div className="flex min-h-2 grow" />
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

import { Await, useLoaderData } from 'react-router-dom';
import { Suspense } from 'react';
import { assertIsInvitationsData } from '../utils/queryRouterLoaderAsserts';
import { assertIsInvitationList } from '../utils/asserts';
import { acceptInvitation } from './acceptInvitation';
import { rejectInvitation } from './rejectInvitation';

export function OngoingInvitations() {
  const data = useLoaderData();
  assertIsInvitationsData(data);

  const handleAccept = async (invitationId: number) => {
    const friend = await acceptInvitation(invitationId);
  };

  const handleReject = async (invitationId: number) => {
    const rejectSuccessful = await rejectInvitation(invitationId);
  };

  return (
    <div>
      <h1>Ongoing Invitations</h1>
      <Suspense fallback={<div>Loading invitaions...</div>}>
        <Await resolve={data.invitaions}>
          {(inviations) => {
            assertIsInvitationList(inviations);
            return (
              <div>
                <ul>
                  {inviations.map((invitation) => (
                    <li key={invitation.id}>
                      <div>
                        <p>
                          Invitation from {invitation.sender.user_name} by means of
                          {invitation.source === 'search'
                            ? ' search'
                            : ` group with id: ${invitation.source}`}
                        </p>
                        <p>Invitation message: {invitation.comment}</p>
                        <button type="button" onClick={() => handleAccept(invitation.id)}>
                          Accept
                        </button>
                        <button type="button" onClick={() => handleReject(invitation.id)}>
                          Reject
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

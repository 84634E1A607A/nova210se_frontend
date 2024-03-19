import { Await, useLoaderData } from 'react-router-dom';
import { Suspense } from 'react';
import { assertIsInvitationsData } from '../utils/queryRouterLoaderAsserts';
import { assertIsInvitationList } from '../utils/asserts';

export function OngoingInvitations() {
  const data = useLoaderData();
  assertIsInvitationsData(data);

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

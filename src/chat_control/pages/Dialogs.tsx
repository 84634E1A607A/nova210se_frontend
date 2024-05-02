import { SingleChatProps } from './ChatHeader';
import { Await, useLoaderData } from 'react-router-dom';
import { assertIsDetailedMessagesData } from '../../utils/AssertsForRouterLoader';
import { Suspense } from 'react';
import { assertIsDetailedMessages } from '../../utils/Asserts';

export function Dialogs({ chat }: SingleChatProps) {
  const loaderData = useLoaderData();
  assertIsDetailedMessagesData(loaderData);
  return (
    <Suspense fallback={<div>Loading messages</div>}>
      <Await resolve={loaderData.detailedMessages}>
        {(detailedMessages) => {
          assertIsDetailedMessages(detailedMessages);
          return (
            <div>
              <p>{chat.chatName}</p>
              <ul>
                {detailedMessages.map((detailedMessage) => {
                  return (
                    <li key={detailedMessage.message_id}>
                      <span>{detailedMessage.sender.user_name}</span>
                      <span>{detailedMessage.message}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}

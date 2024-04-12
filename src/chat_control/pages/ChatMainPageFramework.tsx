import { Suspense } from 'react';
import { useLoaderData, Outlet, Await } from 'react-router-dom';
import { assertIsChatsRelatedWithCurrentUserData } from '../../utils/queryRouterLoaderAsserts';
import { assertIsChatsRelatedWithCurrentUser } from '../../utils/asserts';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { SingleChatTab } from './SingleChatTab';

export function ChatMainPageFramework() {
  const chatsRelatedWithCurrentUserLoaderData = useLoaderData();
  assertIsChatsRelatedWithCurrentUserData(chatsRelatedWithCurrentUserLoaderData);

  return (
    <div className="p-grid">
      <div className="p-col-3">
        <Suspense fallback={<p>Loading chats...</p>}>
          <Await resolve={chatsRelatedWithCurrentUserLoaderData.chatsRelatedWithCurrentUser}>
            {(chatsRelatedWithCurrentUser) => {
              assertIsChatsRelatedWithCurrentUser(chatsRelatedWithCurrentUser);
              return (
                <ul>
                  {chatsRelatedWithCurrentUser.map((chat) => (
                    <li key={chat.chat_id}>
                      <SingleChatTab chat={chat} />
                    </li>
                  ))}
                </ul>
              );
            }}
          </Await>
        </Suspense>
      </div>

      <div className="p-col-9">
        {/* main page for chat apiece */}
        <Outlet />
      </div>
    </div>
  );
}

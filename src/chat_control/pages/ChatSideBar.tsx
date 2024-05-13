import { ReactNode } from 'react';
import { ChatRelatedWithCurrentUser } from '../../utils/Types';
import { SingleChatTab } from '../components/SingleChatTab';
import { RightSideComponentType } from '../states/CurrentChatProvider';
import { DataView } from 'primereact/dataview';
import './css/auto-hidden-scroll.css';

export function ChatSideBar({
  chatsRelatedWithCurrentUser,
  setCurrentChat,
  setRightComponent,
}: Props) {
  const listTemplate = (items: ChatRelatedWithCurrentUser[]): ReactNode[] | undefined => {
    if (items.length === 0) return undefined;
    // ul with key={user_id} ??
    const element = (
      <ul>
        {items.map((chat) => {
          return (
            <li
              key={chat.chat_id}
              onClick={() => {
                setCurrentChat(chat);
                setRightComponent('chat');
              }}
            >
              <SingleChatTab chat={chat} />
            </li>
          );
        })}
      </ul>
    );
    return [element as ReactNode];
  };

  return (
    <div className="auto-hidden-scroll mx-2 flex w-1/6 max-w-72 flex-col">
      <DataView value={chatsRelatedWithCurrentUser} listTemplate={listTemplate} />
    </div>
  );
}

interface Props {
  chatsRelatedWithCurrentUser: ChatRelatedWithCurrentUser[];
  setCurrentChat: (_currentChat: ChatRelatedWithCurrentUser | null) => void;
  setRightComponent: (_rightComponent: RightSideComponentType) => void;
}

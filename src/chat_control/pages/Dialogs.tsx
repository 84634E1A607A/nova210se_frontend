import { SingleChatProps } from './ChatHeader';
import { Await, useLoaderData } from 'react-router-dom';
import { assertIsUserAndFriendsAndDetailedMessagesData } from '../../utils/AssertsForRouterLoader';
import { Suspense, useRef, useState } from 'react';
import {
  assertIsDetailedMessages,
  assertIsFriendsList,
  assertIsLeastUserInfo,
  assertIsMessage,
} from '../../utils/Asserts';
import { MessageTab } from '../components/MessageTab';
import { DetailedMessage, Message } from '../../utils/types';
import { parseAnyoneName } from '../../friend_control/utils/parseAnyoneName';
import { ContextMenu } from 'primereact/contextmenu';
import { useRecalledMessageContext } from '../states/RecalledMessageProvider';

export function Dialogs({ chat }: SingleChatProps) {
  const cm = useRef<ContextMenu | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | undefined>();
  const { setRecalledMessage } = useRecalledMessageContext();

  const recallMessageContextMenuItem = {
    label: 'Reply',
    icon: 'pi pi-reply',
    command: () => setRecalledMessage(selectedMessage!),
  };

  const contextMenuItems = [recallMessageContextMenuItem];

  /**
   * @description When right-click on a message, show the context menu
   */
  const onRightClick = (event: React.MouseEvent, message: DetailedMessage | Message) => {
    if (cm.current) {
      assertIsMessage(message);
      setSelectedMessage(message);
      cm.current.show(event);
    }
  };

  const userAndFriendsAndDetailedMessagesData = useLoaderData();
  assertIsUserAndFriendsAndDetailedMessagesData(userAndFriendsAndDetailedMessagesData);
  return (
    <Suspense fallback={<div>Loading messages</div>}>
      <Await resolve={userAndFriendsAndDetailedMessagesData.detailedMessages}>
        {(detailedMessages) => {
          return (
            <Await resolve={userAndFriendsAndDetailedMessagesData.user}>
              {(currentUser) => {
                return (
                  <Await resolve={userAndFriendsAndDetailedMessagesData.friends}>
                    {(friends) => {
                      assertIsDetailedMessages(detailedMessages);
                      assertIsLeastUserInfo(currentUser);
                      assertIsFriendsList(friends);
                      detailedMessages.sort((a, b) => a.send_time - b.send_time);
                      const getIsSelf = (detailedMessageParam: DetailedMessage) => {
                        return detailedMessageParam.sender.id === currentUser.id;
                      };
                      return (
                        <div>
                          {/*For future, will remove*/}
                          <p>{chat.chatName}</p>

                          <ul>
                            {detailedMessages.map((detailedMessage) => {
                              return (
                                <li
                                  key={detailedMessage.message_id}
                                  onContextMenu={(event) => onRightClick(event, detailedMessage)}
                                >
                                  <MessageTab
                                    message={detailedMessage.message}
                                    isSelf={getIsSelf(detailedMessage)}
                                    name={parseAnyoneName({
                                      unknownUser: detailedMessage.sender,
                                      friends,
                                    })}
                                    sender={detailedMessage.sender}
                                  />
                                </li>
                              );
                            })}
                          </ul>
                          <ContextMenu
                            ref={cm}
                            model={contextMenuItems}
                            onHide={() => {
                              setSelectedMessage(undefined);
                            }}
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

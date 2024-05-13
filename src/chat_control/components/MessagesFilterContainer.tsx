import {
  ChatRelatedWithCurrentUser,
  DetailedMessage,
  DetailedUserInfo,
  LeastUserInfo,
} from '../../utils/Types';
import { Nullable } from 'primereact/ts-helpers';
import { Calendar } from 'primereact/calendar';
import { useRef, useState } from 'react';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { UserTabTemplate } from './UserTabTemplate';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { filterMessages } from '../filterMessages';
import { getDetailedMessagesVerbosely } from '../getDetailedMessagesVerbosely';
import { convertDateToUnixTImeStamp } from '../../utils/time/convertDateToUnixTImeStamp';
import { MessageTab } from './MessageTab';
import { getIsSelf } from '../utils/getIsSelf';
import { messageTabListItemCssClass } from '../ui/MessageTabListItem';

/**
 * @description To hold the entire messages filter. The calendar selector, user selector,
 * and the messages to display.
 * @param chat The current chat.
 * @param currentUser The current user.
 * @param membersWithDisplayName The members of the chat with their names that can be displayed directly.
 */
export function MessagesFilterContainer({ chat, currentUser, membersWithDisplayName }: Props) {
  if (!membersWithDisplayName.find((m) => m.id === currentUser.id)) {
    membersWithDisplayName.push({ ...currentUser, nickname: currentUser.user_name });
  }

  const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);
  const [selectedMembers, setSelectedMembers] = useState<DetailedUserInfo[] | null>(null);

  const toast = useRef<Toast | null>(null);

  const [filteredMessages, setFilteredMessages] = useState<DetailedMessage[] | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(true);

  const handleResult = (ret: any) => {
    if (ret.isSuccessful) {
      ret.messages.sort((a: DetailedMessage, b: DetailedMessage) => a.send_time - b.send_time);
      setFilteredMessages(ret.messages);
      setIsLoading(false);
    } else {
      toast.current!.show({ severity: 'error', summary: 'Failed to filter messages.' });
    }
  };

  const onSubmit = (_e: any) => {
    if (!dates && (!selectedMembers || selectedMembers.length === 0)) {
      getDetailedMessagesVerbosely(chat.chat_id).then((ret) => {
        handleResult(ret);
      });
    } else if (!dates) {
      filterMessages({
        sender: selectedMembers!.map((m) => m.id),
        chatId: chat.chat_id,
      }).then((ret) => {
        handleResult(ret);
      });
    } else if (!selectedMembers || selectedMembers.length === 0) {
      filterMessages({
        chatId: chat.chat_id,
        beginTime: convertDateToUnixTImeStamp(dates[0]!),
        endTime: convertDateToUnixTImeStamp(dates[1]!),
      }).then((ret) => {
        handleResult(ret);
      });
    } else {
      filterMessages({
        chatId: chat.chat_id,
        beginTime: convertDateToUnixTImeStamp(dates[0]!),
        endTime: convertDateToUnixTImeStamp(dates[1]!),
        sender: selectedMembers.map((m) => m.id),
      }).then((ret) => {
        handleResult(ret);
      });
    }
  };

  const messageTabOnRightClick = (_e: any, message: DetailedMessage) => {
    console.log('Right clicked on message', message);
  };

  return (
    <div className="m-4 flex flex-col">
      <strong className="mb-2">Filter messages and display</strong>
      <div className="p-fluid flex flex-row flex-wrap gap-3">
        <div className="p-float-label justify-content-center flex-auto">
          <Calendar
            id="date_range"
            value={dates}
            onChange={(e) => setDates(e.value)}
            selectionMode="range"
            readOnlyInput
            hideOnRangeSelection
            showIcon
          />
          <label htmlFor="date_range">Time Range</label>
        </div>
        <div className="justify-content-center flex-auto">
          <MultiSelect
            value={selectedMembers}
            options={membersWithDisplayName}
            onChange={(e: MultiSelectChangeEvent) => setSelectedMembers(e.value)}
            optionLabel="nickname"
            placeholder="Select Members"
            itemTemplate={UserTabTemplate}
            className="md:w-20rem w-full"
            display="chip"
          />
        </div>
      </div>
      <div className="mt-2 content-center ">
        <Button className="h-3 w-2 justify-center text-xl" onClick={onSubmit}>
          Filter
        </Button>
      </div>
      <Toast ref={toast} />

      {!isLoading && (
        <ul className="m-2 flex flex-col">
          {filteredMessages!.map((detailedMessage) => {
            if (detailedMessage.deleted) return null;
            return (
              <li key={detailedMessage.message_id} className={messageTabListItemCssClass}>
                <MessageTab
                  detailedMessage={detailedMessage}
                  isSelf={getIsSelf(detailedMessage, currentUser)}
                  name={
                    membersWithDisplayName.find((m) => m.id === detailedMessage.sender.id)
                      ?.nickname ?? detailedMessage.sender.user_name
                    // maybe the member was removed
                  }
                  onRightClick={messageTabOnRightClick}
                  chat={chat}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

interface Props {
  chat: ChatRelatedWithCurrentUser;
  currentUser: LeastUserInfo;
  membersWithDisplayName: DetailedUserInfo[];
}

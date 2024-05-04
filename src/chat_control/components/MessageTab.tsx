import { MessageContent } from './MessageContent';
import { Avatar } from '../../utils/ui/Avatar';
import { DetailedMessage } from '../../utils/Types';
import { systemUserName } from '../../utils/ConstValues';
import { RepliedMessageTab } from './RepliedMessageTab';
import { useMessageRefsContext } from '../states/MessageRefsProvider';
import { useEffect, useRef } from 'react';
import { parseSystemMessage } from '../utils/parseSystemMessage';
import { basicTextTailwind } from '../../utils/ui/TailwindConsts';

/**
 * @description The whole message tab, including the avatar of the sender, the message content,
 * the replied message, if any, etc.
 * @param detailedMessage The detailed message.
 * @param isSelf Whether the sender is the current user.
 * @param name The name of the sender to directly display.
 * @param onRightClick For context menu.
 */
export function MessageTab({ detailedMessage, isSelf, name, onRightClick }: Props) {
  const { refs } = useMessageRefsContext();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateRefs = () => {
      refs.push({ messageId: detailedMessage.message_id, ref: ref });
    };
    if (!refs.find((r) => r.messageId === detailedMessage.message_id)) updateRefs();
    return () => {
      refs.splice(
        refs.findIndex((r) => r.messageId === detailedMessage.message_id),
        1,
      );
    };
  }, [detailedMessage, ref, refs]);

  const isSystemInfo = detailedMessage.sender.user_name === systemUserName;
  if (isSystemInfo) {
    const messagesList = parseSystemMessage(detailedMessage.message);
    const inlineStyle = 'text-gray-500 inline';
    const messageComponents = messagesList.map((pair, index) => {
      if (pair.shouldEmphasize) {
        return (
          <strong className={inlineStyle} key={`${index}`}>
            {pair.wordMessage}
          </strong>
        );
      } else {
        return (
          <p className={inlineStyle} key={`${index}`}>
            {pair.wordMessage}
          </p>
        );
      }
    });
    return <div className={`m-2 ${basicTextTailwind} max-w-[38rem]`}>{messageComponents}</div>;
  }

  return (
    <div className="flex h-fit w-fit flex-col" ref={ref}>
      <div className="flex flex-row">
        <div className="left-0 ml-2 mt-2 flex h-9 w-20 flex-col">
          <div className="h-5 w-4">
            <Avatar
              url={detailedMessage.sender.avatar_url}
              enablePopup={true}
              detailedInfo={detailedMessage.sender}
            />
          </div>
          <p className="mt-0.5 w-5 truncate text-left text-xs text-gray-400" title={name}>
            {name}
          </p>
        </div>

        <div onContextMenu={(event) => onRightClick(event, detailedMessage)} className="my-2 flex">
          <MessageContent message={detailedMessage.message} isSelf={isSelf} />
        </div>
      </div>

      <RepliedMessageTab
        message={detailedMessage.reply_to?.message}
        senderName={detailedMessage.reply_to?.sender.user_name}
        messageId={detailedMessage.reply_to?.message_id}
      />
    </div>
  );
}

interface Props {
  detailedMessage: DetailedMessage;
  isSelf: boolean;
  name: string;
  onRightClick: (_event: React.MouseEvent, _message: DetailedMessage) => void;
}

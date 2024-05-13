import { basicTextTailwind } from '../../utils/ui/TailwindConsts';

/**
 * @description Show message content for normal messages, the replied messages in the `Dialogs`.
 * @param message The message content.
 * @param isSelf Whether it's from the current user.
 * @param isReply Whether it's a replied message to display.
 */
export function MessageContent({ message, isSelf, isReply }: Props) {
  const bgColor = isReply ? 'bg-gray-400' : isSelf ? 'bg-emerald-400' : 'bg-blue-400';
  const textColor = isReply ? 'text-gray-300' : isSelf ? 'text-white' : 'text-black';
  return (
    <div
      className={`${bgColor} ml-4 h-fit min-h-7 max-w-[31rem] rounded-2xl border-blue-950 py-2 pe-3 ps-3`}
    >
      <p className={`${textColor} ${basicTextTailwind}`}>{message}</p>
    </div>
  );
}

interface Props {
  message: string;
  isSelf?: boolean;
  isReply?: boolean;
}

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
    <div className={`${bgColor} border-blue-950 ml-4 h-fit min-h-7 min-w-10 max-w-[30rem]`}>
      <p className={`${textColor} text-left break-words whitespace-pre-line p-1.5`}>{message}</p>
    </div>
  );
}

interface Props {
  message: string;
  isSelf?: boolean;
  isReply?: boolean;
}

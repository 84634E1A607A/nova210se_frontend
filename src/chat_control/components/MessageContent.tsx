export function MessageContent({ message, isSelf }: Props) {
  const bgColor = isSelf ? 'bg-emerald-400' : 'bg-slate-300';
  return (
    <div
      className={`${bgColor} p-2 border-blue-950 ml-4 mt-2 mb-1 h-fit min-h-9 min-w-10 max-w-[30rem]`}
    >
      <p className="text-left break-words whitespace-pre-line">{message}</p>
    </div>
  );
}

interface Props {
  message: string;
  isSelf: boolean;
}

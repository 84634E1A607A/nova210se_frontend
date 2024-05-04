import { NoticeCard } from './NoticeCard';

/**
 * @description Show the notifications/notices in a group chat beneath the header.
 */
export function NoticesBar({ chatName }: Props) {
  if (!chatName) {
    // private chat
    return null;
  }

  return (
    <div className="ml-2 flex flex-col p-0.5">
      <div className="m-0.5 block truncate text-left text-xs" title={`${chatName} Public Notices`}>
        <p className="inline">{chatName}</p>
        <p className="inline text-gray-400">{' Public Notices'}</p>
      </div>

      <NoticeCard notice={'None'} />
    </div>
  );
}

interface Props {
  chatName: string | undefined;
}

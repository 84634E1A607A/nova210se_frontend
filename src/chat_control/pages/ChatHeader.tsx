import { Link } from 'react-router-dom';
import { ChatRelatedWithCurrentUser } from '../../utils/Types';
import { ReactComponent as MoreDetails } from '../../svg/more-horizontal-square-svgrepo-com.svg';

export interface SingleChatProps {
  chat: ChatRelatedWithCurrentUser;
}

export function ChatHeader({ chat }: SingleChatProps) {
  return (
    <div className="flex flex-row place-content-center">
      <h2>{chat.chatName}</h2>
      <span className="ml-2 mt-0.5">
        <Link to="more" state={{ chat: chat }}>
          <MoreDetails className="max-h-6 max-w-6" />
        </Link>
      </span>
    </div>
  );
}

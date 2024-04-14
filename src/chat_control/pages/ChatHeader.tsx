import { Link } from 'react-router-dom';
import { ChatRelatedWithCurrentUser } from '../../utils/types';
import { ReactComponent as MoreDetails } from '../../svg/more-horizontal-square-svgrepo-com.svg';

interface Props {
  chat: ChatRelatedWithCurrentUser;
}

export function ChatHeader({ chat }: Props) {
  return (
    <div className="flex flex-row place-content-center">
      <h2>{chat.chatName}</h2>
      <span className="ml-2 mt-0.5">
        <Link to={`/`}>
          <MoreDetails className="max-w-6 max-h-6" />
        </Link>
      </span>
    </div>
  );
}

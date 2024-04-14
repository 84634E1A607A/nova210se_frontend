import { useParams } from 'react-router-dom';

type UrlParams = { user_name: string; chat_id?: string };

function useUrlParams() {
  const params = useParams<UrlParams>();
  const userName = params.user_name!;
  const chatId = params.chat_id ? parseInt(params.chat_id) : undefined;
  return { userName, chatId };
}

export function useUserName() {
  const { userName } = useUrlParams();
  return userName;
}

export function useChatId() {
  const { chatId } = useUrlParams();
  return chatId!;
}

import { ChatRelatedWithCurrentUser } from '../../utils/Types';
import { createContext, useContext, useState } from 'react';
import { ContextProviderChildrenProp } from './RepliedMessageProvider';

interface State {
  currentChat: ChatRelatedWithCurrentUser | null;
}

type CurrentChatContextType = State & {
  setCurrentChat: (_currentChat: ChatRelatedWithCurrentUser | null) => void;
};

const CurrentChatContext = createContext<CurrentChatContextType>({
  currentChat: null,
  setCurrentChat: () => {},
});

export function CurrentChatProvider({ children }: ContextProviderChildrenProp) {
  const [currentChat, setCurrentChat] = useState<ChatRelatedWithCurrentUser | null>(null);
  return (
    <CurrentChatContext.Provider value={{ currentChat, setCurrentChat }}>
      {children}
    </CurrentChatContext.Provider>
  );
}

export const useCurrentChatContext = () => useContext(CurrentChatContext);

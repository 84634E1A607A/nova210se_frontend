import { createContext, useContext } from 'react';
import { ContextProviderChildrenProp } from './RepliedMessageProvider';

const initialContextValue = {
  refs: [],
};

const MessageRefsContext = createContext<MessageRefsContextType>(initialContextValue);

/**
 * @description Provide the refs of all messages.
 */
export function MessageRefsProvider({ children }: ContextProviderChildrenProp) {
  return (
    <MessageRefsContext.Provider value={initialContextValue}>
      {children}
    </MessageRefsContext.Provider>
  );
}

export const useMessageRefsContext = () => useContext(MessageRefsContext);

export interface MessageRef {
  messageId: number;
  ref: React.RefObject<HTMLDivElement>;
}

interface MessageRefsContextType {
  refs: MessageRef[];
}

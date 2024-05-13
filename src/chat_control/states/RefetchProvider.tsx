import { createContext, useContext, useEffect } from 'react';
import { ContextProviderChildrenProp } from './RepliedMessageProvider';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { ChatRelatedWithCurrentUser, DetailedMessage, Friend } from '../../utils/Types';

type RefetchFunctionType<T> = (
  _options?: RefetchOptions | undefined,
) => Promise<QueryObserverResult<T[], Error>>;

interface RefetchContextType {
  messagesRefetch: RefetchFunctionType<DetailedMessage>[];
  friendsRefetch: RefetchFunctionType<Friend>[];
  chatsRefetch: RefetchFunctionType<ChatRelatedWithCurrentUser>[];
}

const defaultValue: RefetchContextType = {
  messagesRefetch: [],
  friendsRefetch: [],
  chatsRefetch: [],
};

const RefetchContext = createContext<RefetchContextType>(defaultValue);

export function RefetchProvider({ children }: ContextProviderChildrenProp) {
  return <RefetchContext.Provider value={defaultValue}>{children}</RefetchContext.Provider>;
}

export const useRefetchContext = () => useContext(RefetchContext);

export function useSetupRefetch<T>(
  refetch: RefetchFunctionType<T>,
  refetchInContext: RefetchFunctionType<T>[],
) {
  useEffect(() => {
    if (refetchInContext.length === 0) {
      refetchInContext.push(refetch);
    }
    return () => {
      refetchInContext.splice(refetchInContext.indexOf(refetch), 1);
    };
  }, [refetch, refetchInContext]);
}

export function tryToRefetch<T>(refetch: RefetchFunctionType<T>[]) {
  if (refetch[0]) refetch[0]();
}

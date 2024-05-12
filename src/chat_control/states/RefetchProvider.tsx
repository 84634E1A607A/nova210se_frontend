import { createContext, useContext } from 'react';
import { ContextProviderChildrenProp } from './RepliedMessageProvider';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { DetailedMessage } from '../../utils/Types';

interface RefetchContextType {
  refetches: ((
    _options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<DetailedMessage[], Error>>)[];
}

const RefetchContext = createContext<RefetchContextType>({
  refetches: [],
});

export function RefetchProvider({ children }: ContextProviderChildrenProp) {
  return (
    <RefetchContext.Provider
      value={{
        refetches: [],
      }}
    >
      {children}
    </RefetchContext.Provider>
  );
}

export const useRefetchContext = () => useContext(RefetchContext);

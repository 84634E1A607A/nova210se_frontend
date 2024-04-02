/**
 * @description deals with displaying avatar, REACT_APP_DEFAULT_AVATAR_URL is the default avatar url if current url is invalid
 */

import { useEffect, useState } from 'react';

type Props = { url?: string };

export function Avatar({ url }: Props) {
  let urlForDisplay = url;
  if (urlForDisplay === undefined || urlForDisplay === null || urlForDisplay === '')
    urlForDisplay = process.env.REACT_APP_DEFAULT_AVATAR_URL!;
  const [urlState, setUrlState] = useState(urlForDisplay);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setUrlState(process.env.REACT_APP_DEFAULT_AVATAR_URL!);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) handleImageError();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  return (
    <img
      src={urlState}
      onError={handleImageError}
      onLoad={() => setIsLoading(false)}
      alt="avatar"
    />
  );
}

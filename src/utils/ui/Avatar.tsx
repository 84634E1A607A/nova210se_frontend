import React, { useEffect, useState } from 'react';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { DetailedInfoPopup } from '../../user_control/components/DetailedInfoPopup';
import { DetailedUserInfo } from '../Types';

type Props = { url?: string; enablePopup?: boolean; detailedInfo?: DetailedUserInfo };

/**
 * @description deals with displaying avatar, REACT_APP_DEFAULT_AVATAR_URL is the default avatar url if current url is invalid
 * @warning If enablePopup is true, detailedInfo must be provided
 * @usage The caller should specify the height and width of the avatar
 */
export function Avatar({ url, enablePopup, detailedInfo }: Props) {
  const defaultUrl = process.env.REACT_APP_DEFAULT_AVATAR_URL!;
  let urlForDisplay = url;
  if (urlForDisplay === undefined || urlForDisplay === null || urlForDisplay === '')
    urlForDisplay = defaultUrl;
  const [urlState, setUrlState] = useState(urlForDisplay);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (url === undefined || url === null || url === '') setUrlState(defaultUrl);
    else setUrlState(url);
  }, [defaultUrl, url]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) setUrlState(defaultUrl);
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [setUrlState, isLoading, url, defaultUrl]);

  // I truly don't know the exact type of e
  const showTemplate = (e: any) => {
    confirmPopup({
      target: e.currentTarget,
      message: <DetailedInfoPopup detailedInfo={detailedInfo!} />,
      acceptClassName: 'hidden',
      rejectClassName: 'hidden',
    });
  };

  return (
    <>
      <ConfirmPopup />
      <img
        src={urlState}
        style={{ borderRadius: '30%', width: '100%', height: '100%' }}
        onError={() => setUrlState(defaultUrl)}
        onLoad={() => setIsLoading(false)}
        alt="avatar"
        onClick={(e) => {
          if (enablePopup) showTemplate(e);
        }}
      />
    </>
  );
}

import React, { useEffect, useState } from 'react';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { DetailedInfoPopup } from '../../user_control/components/DetailedInfoPopup';
import { DetailedUserInfo } from '../types';

type Props = { url?: string; enablePopup?: boolean; detailedInfo?: DetailedUserInfo };

/**
 * @description deals with displaying avatar, REACT_APP_DEFAULT_AVATAR_URL is the default avatar url if current url is invalid
 * @warning If enablePopup is true, detailedInfo must be provided
 */
export function Avatar({ url, enablePopup, detailedInfo }: Props) {
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
        onError={handleImageError}
        onLoad={() => setIsLoading(false)}
        alt="avatar"
        onClick={(e) => {
          if (enablePopup) showTemplate(e);
        }}
      />
    </>
  );
}

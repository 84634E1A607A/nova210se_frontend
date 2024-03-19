import React from 'react';
// import { useParams } from 'react-router-dom';
import { DisplayCurrentUserInfo } from '../user_control/DisplayCurrentUserInfo';

// type Params = { user_name: string };

export function MainPageFramework() {
  // const params = useParams<Params>(); // user_name: params.user_name
  return (
    <div>
      <DisplayCurrentUserInfo />
    </div>
  );
}

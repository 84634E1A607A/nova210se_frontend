import React from 'react';
// import { useParams } from 'react-router-dom';
import { DisplayUserInfo } from '../user_control/DisplayUserInfo';

// type Params = { user_name: string };

export function MainPageFramework() {
  // const params = useParams<Params>(); // user_name: params.user_name
  return (
    <div>
      <DisplayUserInfo />
    </div>
  );
}

import { LoginInfo } from './types';
import { PostMethodReturn } from './types';
import { ChooseLoginType } from './types';

export async function handleSubmittedLoginInfo(
  contact: LoginInfo,
  submitType: ChooseLoginType,
): Promise<PostMethodReturn> {
  console.log(contact.user_name, 'trying to login');
  const response = await fetch(
    process.env.REACT_APP_API_USER_CONTROL_URL!.concat('/', submitType),
    {
      method: 'POST',
      body: JSON.stringify(contact),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  if (response.ok)
    return {
      status_code: response.status,
      ok: true,
      message: submitType === 'login' ? 'Login successful' : 'Registration successful',
    };

  let fail_info = '';
  switch (response.status) {
    case 409:
      fail_info = 'User name already exists, switch to a new one to register';
      break;
    case 403:
      fail_info = 'User does not exist or password is incorrect';
      break;
  }
  if (response.status >= 500) fail_info = 'Internal server error';
  if (response.status >= 300 && response.status < 400) fail_info = 'Redirect error';
  return { status_code: response.status, ok: false, message: fail_info };
}

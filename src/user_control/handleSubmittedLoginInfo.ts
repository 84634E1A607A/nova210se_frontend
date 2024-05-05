import { LoginInfo } from '../utils/Types';
import { PostMethodReturn } from '../utils/Types';
import { ChooseLoginType } from '../utils/Types';

export async function handleSubmittedLoginInfo(
  contact: LoginInfo,
  submitType: ChooseLoginType,
): Promise<PostMethodReturn> {
  const url = `${process.env.REACT_APP_API_URL!}/user/${submitType}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(contact),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // without it, cookie can't be set (include)
    });

    if (response.ok) {
      return {
        status_code: response.status,
        ok: true,
        message: submitType === 'login' ? 'Login successful' : 'Registration successful',
      };
    }

    const failInfo = getFailureMessage(response.status);
    return { status_code: response.status, ok: false, message: failInfo };
  } catch (error) {
    console.error('Error', error);
    window.alert('Failed to login');
    return { status_code: 500, ok: false, message: 'Internal server error' };
  }
}

function getFailureMessage(status: number): string {
  switch (status) {
    case 409:
      return 'User name already exists, switch to a new one to register';
    case 403:
      return 'User does not exist or password is incorrect';
    case 500:
      return 'Internal server error';
    default:
      if (status >= 300 && status < 400) {
        return 'Redirect error';
      } else {
        return 'Unknown error';
      }
  }
}

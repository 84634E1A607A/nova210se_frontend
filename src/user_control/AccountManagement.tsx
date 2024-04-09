import { useForm } from 'react-hook-form';
import { ValidationError, getEditorStyle } from '../utils/ValidationError';
import { editUserInfo } from './editUserInfo';
import { logout } from './logout';
import { deleteAccount } from './deleteAccount';
import { useNavigate } from 'react-router-dom';
import { theme } from '../utils/ui/themes';
import { maxUserNameLength } from '../utils/ConstValues';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LeastUserInfo } from '../utils/types';

/**
 * For changing username, avatar_url, password etc. To change e-mail and phone number. Or to logout, delete account, etc.
 * @returns JSX.Element
 */
export function AccountManagement() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, dirtyFields },
    setValue,
  } = useForm<EditingInfo>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      old_password: '',
      new_password: '',
      avatar_url: '',
      phone: '',
      email: '',
      user_name: '',
    },
  });

  const onSubmit = async (info: EditingInfo) => {
    if (
      info.new_password === '' &&
      info.avatar_url === '' &&
      info.phone === '' &&
      info.email === '' &&
      info.user_name === ''
    ) {
      const errorMessageForNoFieldAtAll = 'At least one field must be filled in';
      setError('new_password', { message: errorMessageForNoFieldAtAll });
      setError('avatar_url', { message: errorMessageForNoFieldAtAll });
      setError('phone', { message: errorMessageForNoFieldAtAll });
      setError('email', { message: errorMessageForNoFieldAtAll });
      setError('user_name', { message: errorMessageForNoFieldAtAll });
      return;
    }
    if (
      (info.new_password !== '' || info.phone !== '' || info.email !== '') &&
      info.old_password === ''
    ) {
      const errorMessageForNoOldPassword =
        'If you want to change your password or phone number or email, you must provide your old password';
      setError('old_password', { message: errorMessageForNoOldPassword });
      if (info.new_password !== '')
        setError('new_password', { message: errorMessageForNoOldPassword });
      if (info.phone !== '') setError('phone', { message: errorMessageForNoOldPassword });
      if (info.email !== '') setError('email', { message: errorMessageForNoOldPassword });
      return;
    }

    return await editUserInfo(
      info.old_password!,
      info.new_password!,
      info.avatar_url!,
      info.phone!,
      info.email!,
      info.user_name!,
    ).then((user) => {
      if (user === undefined) setError('old_password', { message: 'Old password is incorrect' });
      return user;
    });
  };

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: onSubmit,
    onSuccess: (nowUser) => {
      if (nowUser === undefined) return;
      queryClient.setQueryData<LeastUserInfo>(['user'], () => {
        return { ...nowUser };
      });
      navigate(`/${nowUser.user_name}/account_management`);
    },
  });

  return (
    <div className="grow flex-col">
      <form noValidate onSubmit={handleSubmit((form) => mutate(form))}>
        <div>
          <label htmlFor="user_name">New User Name</label>
          <input
            type="text"
            id="user_name"
            {...register('user_name', {
              maxLength: {
                value: maxUserNameLength,
                message: `User name must be at most ${maxUserNameLength} characters long`,
              },
            })}
            className={getEditorStyle(errors.user_name)}
          />
          <ValidationError fieldError={errors.user_name} />
        </div>
        <div>
          <label htmlFor="avatar_url">New Avatar URL</label>
          <input
            type="text"
            id="avatar_url"
            {...register('avatar_url', {
              maxLength: { value: 490, message: 'User name must be at most 490 characters long' },
              pattern: {
                // start with http(s)://
                value: /^(http|https):\/\/.*$/,
                message: 'Invalid URL: it must start with http:// or https://',
              },
            })}
            className={getEditorStyle(errors.avatar_url)}
            placeholder="https://dummy-example.com/yourDummy.png"
          />
          <ValidationError fieldError={errors.avatar_url} />
        </div>
        <div>
          <label htmlFor="new_password">New Password</label>
          <input
            type="password"
            id="new_password"
            {...register('new_password', {
              maxLength: { value: 100, message: 'Password must be at most 100 characters long' },
              minLength: { value: 6, message: 'Password must be at least 6 characters long' },
              pattern: {
                value: /^[^\s]*$/,
                message: 'Password cannot contain blank spaces',
              },
            })}
            className={getEditorStyle(errors.new_password)}
          />
          <ValidationError fieldError={errors.new_password} />
        </div>
        <div>
          <label htmlFor="phone">New phone number</label>
          <input
            type="tel"
            id="phone"
            {...register('phone', {
              maxLength: { value: 11, message: 'Too long' },
              minLength: { value: 11, message: 'Too short' },
              pattern: {
                value: /^[0-9]*$/,
                message: 'Phone number must contain only digits',
              },
            })}
            className={getEditorStyle(errors.phone)}
          />
          <ValidationError fieldError={errors.phone} />
        </div>
        <div>
          <label htmlFor="email">New email</label>
          <input
            type="email"
            id="email"
            {...register('email', {
              maxLength: { value: 100, message: 'Email must be at most 100 characters long' },
              pattern: {
                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                message: 'Email pattern should be correct',
              },
            })}
            className={getEditorStyle(errors.email)}
          />
          <ValidationError fieldError={errors.email} />
        </div>
        <div
          className={`${getHiddenOrVisibleEditorStyle(dirtyFields.new_password, dirtyFields.phone, dirtyFields.email)}`}
        >
          <label htmlFor="old_password">Old Password</label>
          <input
            type="password"
            id="old_password"
            {...register('old_password', {
              maxLength: { value: 100, message: 'Password must be at most 100 characters long' },
              minLength: { value: 6, message: 'Password must be at least 6 characters long' },
              pattern: {
                value: /^[^\s]*$/,
                message: 'Password cannot contain blank spaces',
              },
            })}
            className={`${getEditorStyle(errors.old_password)}`}
          />
          <ValidationError fieldError={errors.old_password} />
        </div>
        <div>
          <button
            type="submit"
            onClick={() => {
              if (!dirtyFields.new_password && !dirtyFields.phone && !dirtyFields.email)
                setValue('old_password', '');
            }}
          >
            Submit
          </button>
        </div>
      </form>
      <div className="flex flex-col pt-6 space-y-2 items-center">
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded 
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          style={{ backgroundColor: theme.tertiary_container }}
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          Logout
        </button>
        <button
          className="bg-teal-700 hover:bg-teal-900 text-white font-bold py-2 px-4 rounded 
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          style={{ backgroundColor: theme.error }}
          onClick={() => {
            const confirmDelete = window.confirm('Are you sure you want to delete your account?');
            if (!confirmDelete) return;
            deleteAccount();
            navigate('/');
            window.alert('Account deleted');
          }}
        >
          Delete account
        </button>
      </div>
    </div>
  );
}

export type EditingInfo = {
  old_password?: string;
  new_password?: string;
  avatar_url?: string;
  phone?: string;
  email?: string;
  user_name?: string;
};

function getHiddenOrVisibleEditorStyle(
  newPasswordExists: boolean | undefined,
  phoneExists: boolean | undefined,
  emailExists: boolean | undefined,
) {
  if (!newPasswordExists && !phoneExists && !emailExists) return 'hidden';
}

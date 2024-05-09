import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';

import { LoginInfo } from '../utils/Types';
import { ValidationError, getEditorStyle } from '../utils/ValidationError';
import { handleSubmittedLoginInfo } from './handleSubmittedLoginInfo';
import { ChooseLoginType } from '../utils/Types';
import { theme } from '../utils/ui/themes';
import { useQueryClient } from '@tanstack/react-query';
import { validateUserName } from './utils/validateUserName';
import { maxlengthOption, pattern } from './utils/userNameFormOptions';

/**
 * @description The user_name can't be #SYSTEM etc. But nickname can be.
 */
export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInfo>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  const navigate = useNavigate();

  const [isWrongSubmit, setIsWrongSubmit] = useState(false);
  const [wrongMessage, setWrongMessage] = useState<string | undefined>();

  const buttonTypeRef = useRef<ChooseLoginType>('login');
  const queryClient = useQueryClient();

  const onSubmit = (contact: LoginInfo) => {
    handleSubmittedLoginInfo(contact, buttonTypeRef.current)
      .then((response) => {
        if (response.ok) {
          queryClient.clear();
          navigate('/' + contact.user_name);
        } else {
          setIsWrongSubmit(true);
          setWrongMessage(response.message);
        }
      })
      .catch((_error) => {
        window.alert('Fatal error during login (such as network abortion), please try again!');
        navigate('/login');
      });
    //_error's underscore shows that it's unused intentionally and deliberately, ignored by eslint
  };

  return (
    <div
      className="mx-auto mt-20 box-border flex h-80 w-80 items-center justify-center border-4 p-4 shadow-lg"
      style={{ backgroundColor: theme.background }}
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="user_name" className="block text-left">
            <span className="block text-sm font-medium text-slate-700">User Name</span>
            <input
              type="text"
              id="user_name"
              {...register('user_name', {
                required: 'You must enter your user_name',
                maxLength: maxlengthOption,
                pattern: pattern,
                validate: (value) => validateUserName(value),
              })}
              className={`${getEditorStyle(errors.user_name)} mt-1 block w-60 rounded-md border 
                border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm
                focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500
                disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 
                disabled:shadow-none
               `}
            />
            <ValidationError fieldError={errors.user_name} />
          </label>
        </div>
        <div>
          <label htmlFor="password" className="mt-5 block text-left">
            <span className="block text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              id="passwd"
              {...register('password', {
                required: 'You must enter your password',
                minLength: { value: 6, message: 'Password must be at least 6 characters long' },
                maxLength: { value: 100, message: 'Password must be at most 100 characters long' },
                pattern: {
                  value: /^[^\s]*$/,
                  message: 'Password cannot contain blank spaces',
                },
              })}
              className={`${getEditorStyle(errors.password)} mt-1 block w-60 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm
                focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500
                disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none
                `}
            />
            <ValidationError fieldError={errors.password} />
          </label>
        </div>
        <div className="mt-5 flex w-full justify-between">
          <button
            className="focus:shadow-outline rounded bg-teal-500 px-4 py-2 font-bold text-white 
                     hover:bg-teal-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            type="submit"
            onClick={() => (buttonTypeRef.current = 'register')}
            disabled={isSubmitting}
          >
            Register
          </button>
          <button
            className="rounded bg-teal-700 px-4 py-2 font-bold text-white hover:bg-teal-900 
                     focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            type="submit"
            onClick={() => (buttonTypeRef.current = 'login')}
            disabled={isSubmitting}
          >
            Login
          </button>
        </div>
      </form>
      <div>
        {isWrongSubmit && (
          <div
            role="alert"
            className="absolute left-0 top-0 w-full p-4 text-center text-white"
            style={{ backgroundColor: theme.error }}
          >
            {wrongMessage || 'Error during login, please try again!'}
          </div>
        )}
      </div>
    </div>
  );
}

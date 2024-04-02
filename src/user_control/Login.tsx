import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';

import { LoginInfo } from '../utils/types';
import { ValidationError, getEditorStyle } from '../utils/ValidationError';
import { handleSubmittedLoginInfo } from './handleSubmittedLoginInfo';
import { ChooseLoginType } from '../utils/types';
import { theme } from '../utils/ui/themes';

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

  const onSubmit = (contact: LoginInfo) => {
    handleSubmittedLoginInfo(contact, buttonTypeRef.current)
      .then((response) => {
        if (response.ok) {
          // login(); // set auth state so that not everyone can arbitrarily enter but only logged-in user
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
    //_error's underscore shows that it's unused intentionally, ignored by eslint
  };

  return (
    <div
      className="box-border p-4 border-4 w-80 h-80 flex items-center justify-center shadow-lg mx-auto mt-20"
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
                maxLength: { value: 32, message: 'User name must be at most 32 characters long' },
                pattern: {
                  value: /^[a-zA-Z0-9-_()@.]+$/,
                  message:
                    'Invalid user name. Only a-z A-Z 0-9 - _ ( ) @ . are allowed. At least 1 character.',
                },
              })}
              className={`${getEditorStyle(errors.user_name)} mt-1 block w-60 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                invalid:border-pink-500 invalid:text-pink-600
                focus:invalid:border-pink-500 focus:invalid:ring-pink-500`}
            />
            <ValidationError fieldError={errors.user_name} />
          </label>
        </div>
        <div>
          <label htmlFor="password" className="block text-left mt-5">
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
              className={`${getEditorStyle(errors.password)} mt-1 block w-60 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                invalid:border-pink-500 invalid:text-pink-600
                focus:invalid:border-pink-500 focus:invalid:ring-pink-500`}
            />
            <ValidationError fieldError={errors.password} />
          </label>
        </div>
        <div className="flex justify-between w-full mt-7">
          <button
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded 
              focus:outline-none focus:shadow-outline focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            type="submit"
            onClick={() => (buttonTypeRef.current = 'register')}
            disabled={isSubmitting}
          >
            Register
          </button>
          <button
            className="bg-teal-700 hover:bg-teal-900 text-white font-bold py-2 px-4 rounded 
              focus:outline-none focus:shadow-outline focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
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
            className="absolute top-0 left-0 w-full p-4 text-white text-center"
            style={{ backgroundColor: theme.error }}
          >
            {wrongMessage || 'Error during login, please try again!'}
          </div>
        )}
      </div>
    </div>
  );
}

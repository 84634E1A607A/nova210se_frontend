import React from 'react';
import { useForm, FieldError } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';

import { LoginInfo } from './types';
import { LoginValidationError } from './LoginValidationError';
import { handleSubmittedLoginInfo } from './handleSubmittedLoginInfo';
import { ChooseLoginType } from './types';

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInfo>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  // const navigate = useNavigate();

  const [isWrongSubmit, setIsWrongSubmit] = useState(false);
  const [wrongMessage, setWrongMessage] = useState<string | undefined>();

  const buttonTypeRef = useRef<ChooseLoginType>('login');

  const onSubmit = (contact: LoginInfo) => {
    handleSubmittedLoginInfo(contact, buttonTypeRef.current).then((response) => {
      if (response.ok) {
        // navigate('/home');
        console.log('Login successful');
      } else {
        setIsWrongSubmit(true);
        setWrongMessage(response.message);
      }
    });
  };

  function getEditorStyle(fieldError: FieldError | undefined) {
    return fieldError ? 'border-red-500' : '';
  }

  return (
    <div>
      <h1>Login</h1>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="user_name">User Name</label>
          <input
            type="text"
            id="user_name"
            {...register('user_name', {
              required: 'You must enter your user_name',
              pattern: {
                value: /^[a-zA-Z0-9-_()@.]+$/,
                message:
                  'Invalid user name. Only a-z A-Z 0-9 - _ ( ) @ . are allowed. At least 1 character.',
              },
            })}
            className={getEditorStyle(errors.user_name)}
          ></input>
          <LoginValidationError fieldError={errors.user_name} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="passwd"
            {...register('password', {
              required: 'You must enter your password',
              minLength: { value: 6, message: 'Password must be at least 6 characters long' },
              pattern: {
                value: /^[^\s]*$/,
                message: 'Password cannot contain blank spaces',
              },
            })}
            className={getEditorStyle(errors.password)}
          ></input>
          <LoginValidationError fieldError={errors.password} />
        </div>
        <div>
          <button type="submit" onClick={() => (buttonTypeRef.current = 'login')}>
            Login
          </button>
          <button type="submit" onClick={() => (buttonTypeRef.current = 'register')}>
            Register
          </button>
        </div>
      </form>
      {isWrongSubmit && (
        <p role="alert">{wrongMessage || 'Error during login, please try again!'}</p>
      )}
    </div>
  );
}

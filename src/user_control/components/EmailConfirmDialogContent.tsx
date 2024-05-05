import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { ValidationError, getEditorStyle } from '../../utils/ValidationError';
import { EditingInfo } from '../AccountManagement';

type Props = {
  register: UseFormRegister<EditingInfo>;
  maxUserNameLength: number;
  errors: FieldErrors<EditingInfo>;
};

export function EmailConfirmDialogContent({ register, maxUserNameLength, errors }: Props) {
  return (
    <form noValidate>
      <div>
        <label htmlFor="email" className="block text-left">
          <span className="block text-sm font-medium text-slate-700">Email</span>
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
            className={`mt-1 block w-60 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
         `}
          />
          <ValidationError fieldError={errors.email} />
        </label>
      </div>
      <div>
        <label htmlFor="password" className="block text-left mt-5">
          <span className="block text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            id="passwd"
            {...register('old_password', {
              required: 'You must enter your password',
              minLength: { value: 6, message: 'Password must be at least 6 characters long' },
              maxLength: { value: 100, message: 'Password must be at most 100 characters long' },
              pattern: {
                value: /^[^\s]*$/,
                message: 'Password cannot contain blank spaces',
              },
            })}
            className={`${getEditorStyle(errors.old_password)} mt-1 block w-60 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                `}
          />
          <ValidationError fieldError={errors.old_password} />
        </label>
      </div>
    </form>
  );
}

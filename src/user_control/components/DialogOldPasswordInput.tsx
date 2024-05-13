import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { ValidationError } from '../../utils/ValidationError';
import { EditingInfo } from '../AccountManagement';

type Prop = {
  register: UseFormRegister<EditingInfo>;
  errors: FieldErrors<EditingInfo>;
};

export default function DialogOldPasswordInput({ register, errors }: Prop) {
  return (
    <>
      <span className="mt-2 block text-sm font-medium text-slate-700">Old Password</span>
      <input
        type="password"
        id="old_password"
        {...register('old_password', {
          maxLength: {
            value: 100,
            message: 'Password must be at most 100 characters long',
          },
          minLength: { value: 6, message: 'Password must be at least 6 characters long' },
          pattern: {
            value: /^[^\s]*$/,
            message: 'Password cannot contain blank spaces',
          },
        })}
        className={`surface-0 mt-1 block w-72 rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 shadow-sm
                focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500
                disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none
                    `}
      />
      <ValidationError fieldError={errors.old_password} />
    </>
  );
}

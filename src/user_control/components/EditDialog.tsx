import { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ValidationError } from '../../utils/ValidationError';
import { EditingInfo } from '../AccountManagement';
import { useForm } from 'react-hook-form';
import { maxUserNameLength } from '../../utils/consts/InputRestrictions';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { LeastUserInfo } from '../../utils/Types';
import { editUserInfo } from '../editUserInfo';

type Props = {
  field: string;
};

export default function EditDialog({ field }: Props) {
  const [visible, setVisible] = useState<boolean>(false);
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
    ).catch((error) => {
      if (error.message.includes('Username')) setError('user_name', { message: error.message });
      if (error.message.includes('password')) setError('old_password', { message: error.message });
    });
  };

  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: onSubmit,
    retry: 5,
    onError: () => {
      mutation.reset();
    },
    onSettled: () => {},
    onSuccess: (nowUser) => {
      console.log('success');
      console.log(mutation);
      if (nowUser === undefined) return;
      queryClient.setQueryData<LeastUserInfo>(['user'], () => {
        return { ...nowUser };
      });
      mutation.reset(); // setValue('old_password', defaultValues?.old_password) is useless. Maybe because render in batch so no effect
      navigate(`/${nowUser.user_name}/account_management`); // can't use redirect because maybe it doesn't reload data
      toast.current?.show({
        severity: 'info',
        summary: 'Updated!',
        detail: 'User info updated',
        life: 2000,
      });
      setVisible(false);
    },
  });

  return (
    <div className="justify-content-end flex w-6 md:w-2">
      <Button
        label="Edit"
        icon="pi pi-pencil"
        className="p-button-text"
        onClick={() => {
          setVisible(true);
        }}
      />
      <Dialog visible={visible} onHide={() => setVisible(false)} header={`Edit your ${field}`}>
        {/* Avatar Edit Dialog */}
        {field === 'Avatar' && (
          <form
            noValidate
            className="flex flex-col items-center"
            onSubmit={handleSubmit((form) => mutation.mutate(form))}
          >
            <div>
              <label htmlFor="avatar_url" className="mt-2 block text-left">
                <span className="block text-sm font-medium text-slate-700">New Avatar</span>
                <input
                  type="text"
                  id="avatar_url"
                  {...register('avatar_url', {
                    maxLength: {
                      value: 490,
                      message: 'User name must be at most 490 characters long',
                    },
                    pattern: {
                      // start with http(s)://
                      value: /^(http|https):\/\/.*$/,
                      message: 'Invalid URL: it must start with http:// or https://',
                    },
                  })}
                  className={`mt-1 block w-60 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm
                            focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500
                            disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none
             `}
                />
                <ValidationError fieldError={errors.avatar_url} />
              </label>
            </div>
            <div className="mt-5">
              <button
                className="rounded bg-teal-700 px-4 py-2 font-bold text-white hover:bg-teal-900 
                         focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                type="submit"
                onClick={() => {
                  if (!dirtyFields.new_password && !dirtyFields.phone && !dirtyFields.email) {
                    setValue('old_password', '');
                  }
                }}
              >
                {mutation.isPending ? 'loading...' : 'update'}
              </button>
            </div>
          </form>
        )}

        {/* User Name Edit Dialog */}
        {field === 'User Name' && (
          <form
            noValidate
            className="flex flex-col items-center"
            onSubmit={handleSubmit((form) => mutation.mutate(form))}
          >
            <div>
              <label htmlFor="user_name" className="mt-2 block text-left">
                <span className="block text-sm font-medium text-slate-700">New User Name</span>
                <input
                  type="text"
                  id="user_name"
                  {...register('user_name', {
                    required: 'You must enter your user_name',
                    maxLength: {
                      value: maxUserNameLength,
                      message: `User name must be at most ${maxUserNameLength} characters long`,
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9-_()@.]+$/,
                      message:
                        'Invalid user name. Only a-z A-Z 0-9 - _ ( ) @ . are allowed. At least 1 character.',
                    },
                  })}
                  className={`mt-1 block w-60 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm
                            focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500
                            disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none
             `}
                />
                <ValidationError fieldError={errors.user_name} />
              </label>
            </div>
            <div className="mt-5">
              <button
                className="rounded bg-teal-700 px-4 py-2 font-bold text-white hover:bg-teal-900 
                         focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                type="submit"
                onClick={() => {
                  if (!dirtyFields.new_password && !dirtyFields.phone && !dirtyFields.email) {
                    setValue('old_password', '');
                  }
                }}
              >
                {mutation.isPending ? 'loading...' : 'update'}
              </button>
            </div>
          </form>
        )}

        {/* Email Edit Dialog */}
        {field === 'Email' && (
          <form
            noValidate
            className="flex flex-col items-center"
            onSubmit={handleSubmit((form) => mutation.mutate(form))}
          >
            <div>
              <label htmlFor="email" className="mt-2 block text-left">
                <span className="block text-sm font-medium text-slate-700">New Email</span>
                <input
                  type="text"
                  id="email"
                  {...register('email', {
                    maxLength: { value: 100, message: 'Email must be at most 100 characters long' },
                    pattern: {
                      value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                      message: 'Email pattern should be correct',
                    },
                  })}
                  className={`mt-1 block w-72 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm
                            focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500
                            disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none
                             `}
                />
                <ValidationError fieldError={errors.email} />
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
                  className={`mt-1 block w-72 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm
                            focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500
                            disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none
                             `}
                />
                <ValidationError fieldError={errors.old_password} />
              </label>
            </div>
            <div className="mt-5">
              <button
                className="rounded bg-teal-700 px-4 py-2 font-bold text-white hover:bg-teal-900 
                         focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                type="submit"
                onClick={() => {
                  if (!dirtyFields.new_password && !dirtyFields.phone && !dirtyFields.email) {
                    setValue('old_password', '');
                  }
                }}
              >
                {mutation.isPending ? 'loading...' : 'update'}
              </button>
            </div>
          </form>
        )}

        {/* Email Edit Dialog */}
        {field === 'Phone' && (
          <form
            noValidate
            className="flex flex-col items-center"
            onSubmit={handleSubmit((form) => mutation.mutate(form))}
          >
            <div>
              <label htmlFor="phone" className="mt-2 block text-left">
                <span className="block text-sm font-medium text-slate-700">New Phone Number</span>
                <input
                  type="text"
                  id="phone"
                  {...register('phone', {
                    maxLength: { value: 11, message: 'Too long' },
                    minLength: { value: 11, message: 'Too short' },
                    pattern: {
                      value: /^[0-9]*$/,
                      message: 'Phone number must contain only digits',
                    },
                  })}
                  className={`mt-1 block w-72 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm
                            focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500
                            disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none
                             `}
                />
                <ValidationError fieldError={errors.phone} />
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
                  className={`mt-1 block w-72 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm
                            focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500
                            disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none
                             `}
                />
                <ValidationError fieldError={errors.old_password} />
              </label>
            </div>
            <div className="mt-5">
              <button
                className="rounded bg-teal-700 px-4 py-2 font-bold text-white hover:bg-teal-900 
                         focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                type="submit"
                onClick={() => {
                  if (!dirtyFields.new_password && !dirtyFields.phone && !dirtyFields.email) {
                    setValue('old_password', '');
                  }
                }}
              >
                {mutation.isPending ? 'loading...' : 'update'}
              </button>
            </div>
          </form>
        )}

        {/* Password Edit Dialog */}
        {field === 'Password' && (
          <form
            noValidate
            className="flex flex-col items-center"
            onSubmit={handleSubmit((form) => mutation.mutate(form))}
          >
            <div>
              <label htmlFor="new_password" className="mt-2 block text-left">
                <span className="block text-sm font-medium text-slate-700">New Password</span>
                <input
                  type="text"
                  id="new_password"
                  {...register('new_password', {
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
                  className={`mt-1 block w-72 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm
                            focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500
                            disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none
                             `}
                />
                <ValidationError fieldError={errors.new_password} />
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
                  className={`mt-1 block w-72 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm
                            focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500
                            disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none
                             `}
                />
                <ValidationError fieldError={errors.old_password} />
              </label>
            </div>
            <div className="mt-5">
              <button
                className="rounded bg-teal-700 px-4 py-2 font-bold text-white hover:bg-teal-900 
                         focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                type="submit"
                onClick={() => {
                  if (!dirtyFields.new_password && !dirtyFields.phone && !dirtyFields.email) {
                    setValue('old_password', '');
                  }
                }}
              >
                {mutation.isPending ? 'loading...' : 'update'}
              </button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}

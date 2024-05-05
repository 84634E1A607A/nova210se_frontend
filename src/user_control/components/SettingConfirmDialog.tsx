import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import {
  RegisterOptions,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormRegisterReturn,
  useForm,
} from 'react-hook-form';
import { maxUserNameLength } from '../../utils/ConstValues';
import { ValidationError, getEditorStyle } from '../../utils/ValidationError';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { EditingInfo } from '../AccountManagement';
import { editUserInfo } from '../editUserInfo';
import { LeastUserInfo } from '../../utils/types';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { rejectInvitation } from '../../friend_control/rejectInvitation';
import { EmailConfirmDialogContent } from './EmailConfirmDialogContent';

type Props = {
  changeField: string;
  requireOldPassword?: boolean;
};

export function SettingConfirmDialog({ changeField, requireOldPassword = false }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, dirtyFields },
    setValue,
    getValues,
    reset,
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

  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: onSubmit,
    onSuccess: (nowUser) => {
      if (nowUser === undefined) return;
      queryClient.setQueryData<LeastUserInfo>(['user'], () => {
        return { ...nowUser };
      });

      reset(); // setValue('old_password', defaultValues?.old_password) is useless. Maybe because render in batch so no effect
      navigate(`/${nowUser.user_name}/account_management`); // can't use redirect because maybe it doesn't reload data
      // window.alert('User info updated');
      toast.current?.show({
        severity: 'info',
        summary: 'Updated!',
        detail: 'User info updated',
        life: 2000,
      });
    },
  });

  const settingConfirmDialog = () => {
    confirmDialog({
      message: (
        <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
          <span className="font-bold text-2xl block mb-2 mt-4">{changeField}</span>
          <span className="mb-5">{`Change your ${changeField}?`}</span>
          {changeField === 'User Name' && (
            <form noValidate onSubmit={handleSubmit((form) => mutate(form))}>
              <div>
                <label htmlFor="user_name" className="block text-left">
                  <span className="block text-sm font-medium text-slate-700">User Name</span>
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
                    className={`mt-1 block w-60 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
               `}
                  />
                  <ValidationError fieldError={errors.user_name} />
                </label>
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
          )}
          {changeField === 'Email' && (
            <EmailConfirmDialogContent
              register={register}
              maxUserNameLength={maxUserNameLength}
              errors={errors}
            />
          )}
        </div>
      ),
      defaultFocus: 'summit',
      rejectLabel: 'Cancel',
      acceptLabel: 'Accept',

      accept: () => {
        if (!dirtyFields.new_password && !dirtyFields.phone && !dirtyFields.email) {
          setValue('old_password', '');
          const formValues = getValues(); // should add an assert to be EditingInfo in AccountManagement.tsx
          mutate(formValues);
        }
      },
      reject: () => {},
    });
  };

  // const [visible, setVisible] = useState<boolean>(false);

  return (
    <div>
      <Button
        label="Edit"
        icon="pi pi-pencil"
        className="p-button-text"
        onClick={() => settingConfirmDialog()}
      />
    </div>
  );
}

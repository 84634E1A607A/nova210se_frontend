import { useForm } from 'react-hook-form';
import { ValidationError, getEditorStyle } from '../utils/ValidationError';
import { editUserInfo } from './editUserInfo';

// For changing username, avatar_url, password etc. Or to logout, delete account, etc.
export function AccountManagement() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, dirtyFields, touchedFields },
  } = useForm<EdittingInfo>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const onSubmit = async (info: EdittingInfo) => {
    if (info.new_password === '' && info.avatar_url === '') {
      setError('new_password', { message: 'At least one field must be filled in' });
      setError('avatar_url', { message: 'At least one field must be filled in' });
      return;
    }
    await editUserInfo(info.old_password, info.new_password, info.avatar_url).then((user) => {
      if (user === undefined) setError('old_password', { message: 'Old password is incorrect' });
    });
  };

  return (
    <div>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="avatar_url">New Avatar URL</label>
          <input
            defaultValue={''}
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
            defaultValue={''}
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
        <div
          className={`${getHiddenOrVisibleEditorStyle(isValid, dirtyFields.new_password, touchedFields.old_password)}`}
        >
          <label htmlFor="old_password">Old Password</label>
          <input
            defaultValue={''}
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
          <button type="submit"> Submit</button>
        </div>
      </form>
    </div>
  );
}

type EdittingInfo = { old_password?: string; new_password?: string; avatar_url?: string };

function getHiddenOrVisibleEditorStyle(
  wholeFormIsValid: boolean,
  depExists: boolean | undefined,
  selfExists: boolean | undefined,
) {
  if (!(depExists && (wholeFormIsValid || selfExists))) return 'hidden';
  // if (depExists === undefined || depExists === false || wholeFormIsValid === false) return 'hidden';
}

import { FieldError } from 'react-hook-form';

type Props = {
  fieldError: FieldError | undefined;
};

export function ValidationError({ fieldError }: Props) {
  const message =
    fieldError?.message === undefined || fieldError?.message === ''
      ? '\u00A0'
      : fieldError?.message;
  return (
    <div role="alert" className="mt-1 text-xs text-red-500">
      {message}
    </div>
  );
}

export function getEditorStyle(fieldError: FieldError | undefined) {
  return fieldError ? 'border-red-500' : '';
}

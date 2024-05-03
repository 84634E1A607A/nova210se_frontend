import { FieldError } from 'react-hook-form';

type Props = {
  fieldError: FieldError | undefined;
};

export function ValidationError({ fieldError }: Props) {
  return (
    <div role="alert" className="mt-1 text-xs text-red-500">
      {fieldError ? fieldError.message : '\u00A0'}
    </div>
  );
}

export function getEditorStyle(fieldError: FieldError | undefined) {
  return fieldError ? 'border-red-500' : '';
}

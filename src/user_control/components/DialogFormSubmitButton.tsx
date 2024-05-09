import { UseFormSetValue } from 'react-hook-form';
import { EditingInfo } from '../AccountManagement';

type Prop = {
  setValue: UseFormSetValue<EditingInfo>;
  mutation: any;
  dirtyFields: any;
};

export default function DialogFormSubmitButton({ setValue, mutation, dirtyFields }: Prop) {
  return (
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
  );
}

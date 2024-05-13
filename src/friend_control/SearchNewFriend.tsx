import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { getEditorStyle, ValidationError } from '../utils/ValidationError';
import { SearchNewFriendResultList } from './SearchNewFriendResultList';

type SearchForm = { searchParam: string };

export function SearchNewFriend() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchForm>({ mode: 'onBlur', reValidateMode: 'onBlur' });

  const [, setSearchParams] = useSearchParams();

  const onSubmit = ({ searchParam }: SearchForm) => {
    setSearchParams({ search_param: searchParam });
  };

  return (
    <div className="flex grow flex-col">
      <div className="surface-0 mx-auto my-4 box-border inline-block rounded-lg p-4 shadow-md">
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="searchParam">
              Search for others
            </label>
            <input
              type="text"
              id="searchParam"
              {...register('searchParam', { required: 'You must enter a search parameter' })}
              className={
                'mt-1 w-60 rounded-md border' +
                'surface-0 border-slate-300 px-3 py-2 text-sm placeholder-slate-400 shadow-sm' +
                'focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500' +
                'disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 ' +
                'disabled:shadow-none' +
                getEditorStyle(errors.searchParam)
              }
            />
            <ValidationError fieldError={errors.searchParam} />
            <button
              className="focus:shadow-outline mt-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              type="submit"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="mx-auto inline-block min-w-[80%]">
        <SearchNewFriendResultList />
      </div>
    </div>
  );
}

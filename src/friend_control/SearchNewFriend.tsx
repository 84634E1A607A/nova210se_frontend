import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { ValidationError, getEditorStyle } from '../utils/ValidationError';
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
    <div className="grow">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="searchParam">Search for others</label>
          <input
            type="text"
            id="searchParam"
            {...register('searchParam', { required: 'You must enter a search parameter' })}
            className={getEditorStyle(errors.searchParam)}
          />
          <ValidationError fieldError={errors.searchParam} />
        </div>
        <div>
          <button type="submit">Search</button>
        </div>
      </form>
      <SearchNewFriendResultList />
    </div>
  );
}

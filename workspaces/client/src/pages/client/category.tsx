import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { gql, useLazyQuery } from '@apollo/client';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { category, categoryVariables } from '../../__generated__/category';
import { Restaurant } from '../../components/restaurant';
import { useForm } from 'react-hook-form';

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
}

interface IFormProps {
  searchTerm: string;
}

export const Category: React.FC = () => {
  const params = useParams<ICategoryParams>();
  const history = useHistory();

  const [callQuery, { data }] = useLazyQuery<category, categoryVariables>(CATEGORY_QUERY);

  useEffect(() => {
    callQuery({
      variables: {
        input: {
          page: 1,
          slug: params.slug,
        },
      },
    });
  }, [callQuery, params.slug]);

  const { register, handleSubmit, getValues } = useForm<IFormProps>();

  const [page, setPage] = useState<number>(1);

  const onNextPageClick = () => {
    setPage(current => current + 1);
  };
  const onPreviousPageClick = () => {
    setPage(current => current - 1);
  };

  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: '/search',
      search: `?term=${searchTerm}`,
    });
  };

  return (
    <div>
      <form
        className="bg-gray-800 w-full py-3 flex items-center justify-center"
        onSubmit={handleSubmit(onSearchSubmit)}
      >
        <input
          name="searchTerm"
          type="Search"
          className="input rounded-md border-0 w-3/4 md:w-3/12 py-2"
          placeholder="Search Restaurants..."
          ref={register({ required: true, min: 3 })}
        />
      </form>
      <div className="xl:grid xl:grid-cols-4 xl:gap-x-4">
        <div className="flex justify-around max-w-xs mx-auto xl:flex-col xl:justify-start">
          {data?.allCategories.categories?.map(category => (
            <Link to={`/category/${category.slug}`} key={category.id}>
              <div className="flex flex-col items-center cursor-pointer group  xl:flex-row xl:justify-start xl:bg-gray-300 xl:rounded-full xl:px-4 xl:pr-6 xl:hover:bg-gray-200 xl:mt-2">
                <div
                  className="w-14 h-14 bg-cover group-hover:bg-gray-100 rounded-full xl:mr-2 xl:w-12 xl:h-12 "
                  style={{ backgroundImage: `url(${category.coverImg})` }}
                />
                <span className="text-lg font-bold">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="col-span-3">
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mx-4">
            {data?.category.restaurants?.map(restaurant => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id + ''}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
            {page > 1 ? (
              <button
                onClick={onPreviousPageClick}
                className="focus:outline-none font-bold text-2xl"
              >
                &larr;
              </button>
            ) : (
              <div />
            )}
            <span>
              Page {page} of {data?.category.totalPages}
            </span>
            {page !== data?.category.totalPages ? (
              <button onClick={onNextPageClick} className="focus:outline-none font-bold text-2xl">
                &rarr;
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

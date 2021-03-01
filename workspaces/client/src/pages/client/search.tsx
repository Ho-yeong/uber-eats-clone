import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { gql, useLazyQuery } from '@apollo/client';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { searchRestaurant, searchRestaurantVariables } from '../../__generated__/searchRestaurant';
import { useForm } from 'react-hook-form';
import { Restaurant } from '../../components/restaurant';

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface IFormProps {
  searchTerm: string;
}

export const Search: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

  const { register, handleSubmit, getValues } = useForm<IFormProps>();

  const [page, setPage] = useState<number>(1);

  const onNextPageClick = () => {
    setPage(current => current + 1);
  };
  const onPreviousPageClick = () => {
    setPage(current => current - 1);
  };

  const [callQuery, { data }] = useLazyQuery<searchRestaurant, searchRestaurantVariables>(
    SEARCH_RESTAURANT,
  );
  useEffect(() => {
    //eslint-disable-next-line
    const [_, query] = location.search.split('?term=');
    if (!query) {
      // push 와 다르게 브라우저에 이전 페이지의 기록이 저장되지 않는다.
      return history.replace('/');
    }
    callQuery({
      variables: {
        input: {
          page: 1,
          query,
        },
      },
    });
  }, [callQuery, history, location.search]);

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
      <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mx-4">
        {data?.searchRestaurant.restaurants?.map(restaurant => (
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
          <button onClick={onPreviousPageClick} className="focus:outline-none font-bold text-2xl">
            &larr;
          </button>
        ) : (
          <div />
        )}
        <span>
          Page {page} of {data?.searchRestaurant.totalPages}
        </span>
        {page !== data?.searchRestaurant.totalPages ? (
          <button onClick={onNextPageClick} className="focus:outline-none font-bold text-2xl">
            &rarr;
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

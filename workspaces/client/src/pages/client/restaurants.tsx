import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from '../../__generated__/restaurantsPageQuery';
import { Restaurant } from '../../components/restaurant';
import { useForm } from 'react-hook-form';
import { useHistory, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface IFormProps {
  searchTerm: string;
}

export const Restaurants = () => {
  const [page, setPage] = useState<number>(1);
  const { data, loading } = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(
    RESTAURANTS_QUERY,
    {
      variables: {
        input: {
          page,
        },
      },
    },
  );

  const onNextPageClick = () => {
    setPage(current => current + 1);
  };
  const onPreviousPageClick = () => {
    setPage(current => current - 1);
  };

  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const history = useHistory();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: '/search',
      search: `?term=${searchTerm}`,
    });
  };

  return (
    <div>
      <Helmet>
        <title> Home | Uber Eats</title>
      </Helmet>
      <form
        className="bg-gray-800 w-full py-40 flex items-center justify-center"
        onSubmit={handleSubmit(onSearchSubmit)}
      >
        <input
          name="searchTerm"
          type="Search"
          className="input rounded-md border-0 w-3/4 md:w-3/12"
          placeholder="Search Restaurants..."
          ref={register({ required: true, min: 3 })}
        />
      </form>
      {!loading && (
        <div className="max-w-screen-2xl mx-auto mt-8 pb-20">
          <div className="flex justify-around max-w-xs mx-auto">
            {data?.allCategories.categories?.map(category => (
              <Link to={`/category/${category.slug}`} key={category.id}>
                <div className="flex flex-col items-center cursor-pointer group">
                  <div
                    className="w-14 h-14 bg-cover group-hover:bg-gray-100 rounded-full "
                    style={{ backgroundImage: `url(${category.coverImg})` }}
                  />
                  <span className="text-lg font-bold ">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.restaurants.results?.map(restaurant => (
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
              Page {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
              <button onClick={onNextPageClick} className="focus:outline-none font-bold text-2xl">
                &rarr;
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

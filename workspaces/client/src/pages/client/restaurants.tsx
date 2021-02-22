import { gql, useQuery } from '@apollo/client';
import React from 'react';
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from '../../__generated__/restaurantsPageQuery';

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

export const Restaurant = () => {
  const { data, loading } = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(
    RESTAURANTS_QUERY,
    {
      variables: {
        input: {
          page: 1,
        },
      },
    },
  );
  console.log(data);

  return (
    <div>
      <form className="bg-gray-800 w-full py-40 flex items-center justify-center">
        <input
          type="Search"
          className="input rounded-md border-0 w-3/12"
          placeholder="Search Restaurants..."
        />
      </form>
      {!loading && (
        <div className="max-w-screen-2xl mx-auto mt-8">
          <div className="flex justify-around max-w-xs mx-auto ">
            {data?.allCategories.categories?.map(category => (
              <div className="flex flex-col items-center cursor-pointer group" key={category.id}>
                <div
                  className="w-14 h-14 bg-cover group-hover:bg-gray-100 rounded-full "
                  style={{ backgroundImage: `url(${category.coverImg})` }}
                />
                <span className="text-lg font-bold ">{category.name}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-x-5 gap-y-10">
            {data?.restaurants.results?.map(restaurant => (
              <div key={restaurant.id} className="flex flex-col">
                <div
                  style={{ backgroundImage: `url(${restaurant.coverImg})` }}
                  className="bg-cover bg-center mb-3 py-24 mt-10"
                />
                <h3 className="text-lg font-bold">{restaurant.name}</h3>
                <span className="border-t py-2 mt-3 text-xs opacity-50 border-gray-400">
                  {restaurant.category?.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

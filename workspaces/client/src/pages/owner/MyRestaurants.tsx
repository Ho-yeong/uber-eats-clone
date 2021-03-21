import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Restaurant } from '../../components/restaurant';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { myRestaurants, myRestaurants_myRestaurants } from '../../__generated__/myRestaurants';

export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants: React.FC = () => {
  const { data } = useQuery<myRestaurants, myRestaurants_myRestaurants>(MY_RESTAURANTS_QUERY);

  return (
    <div>
      <Helmet>
        <title>My Restaurants</title>
      </Helmet>
      <div className="max-w-screen-2xl mx-auto mt-32">
        <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
        {data?.myRestaurants.ok && data.myRestaurants.restaurants?.length === 0 ? (
          <>
            <h4 className="text-xl mb-5">You have no restaurnats.</h4>
            <Link className="text-lime-600 hover:underline" to="/add-restaurant">
              Create One &rarr;
            </Link>
          </>
        ) : (
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.myRestaurants.restaurants?.map(restaurant => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id + ''}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

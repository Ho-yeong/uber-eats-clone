import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { gql, useLazyQuery } from '@apollo/client';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { searchRestaurant, searchRestaurantVariables } from '../../__generated__/searchRestaurant';

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

export const Search: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

  const [callQuery, { loading, data }] = useLazyQuery<searchRestaurant, searchRestaurantVariables>(
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
  }, [history, location.search]);

  return <h1>Search Page</h1>;
};

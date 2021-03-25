import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { restaurant, restaurantVariables } from '../../__generated__/restaurant';
import { Dish } from '../../components/dish';
import { CreateOrderItemInput } from '../../__generated__/globalTypes';

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IRestaurantParams {
  id: string;
}

export const Restaurant = () => {
  const params = useParams<IRestaurantParams>();

  const { data } = useQuery<restaurant, restaurantVariables>(RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: +params.id,
      },
    },
  });

  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const triggerStartOrder = () => {
    setOrderStarted(true);
  };

  const addItemToOrder = (dishId: number) => {
    if (orderItems.find(order => order.dishId === dishId)) {
      return;
    }
    setOrderItems(current => [{ dishId, options: null }, ...current]);
  };

  const isSelected = (dishId: number) => {
    return Boolean(orderItems.find(order => order.dishId === dishId));
  };

  const removeFromOrder = (dishId: number) => {
    setOrderItems(current => current.filter(dish => dish.dishId !== dishId));
  };

  console.log(orderItems);

  return (
    <div>
      <div
        className="bg-gray-600 py-48 bg-center bg-cover"
        style={{ backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})` }}
      >
        <div className="bg-white w-1/4 py-8 pl-52">
          <h4 className="text-4xl mb-3">{data?.restaurant.restaurant?.name}</h4>
          <h5 className="text-sm font-light mt-2">{data?.restaurant.restaurant?.category?.name}</h5>
          <h6 className="text-sm font-light">{data?.restaurant.restaurant?.address}</h6>
        </div>
      </div>
      <div className="mt-10 container flex flex-col items-end">
        <button className="btn px-10 mb-10" onClick={triggerStartOrder}>
          {orderStarted ? 'Ordering' : 'Start Order'}
        </button>
        <div className="w-full grid md:grid-cols-3 gap-x-5 gap-y-10">
          {data?.restaurant.restaurant?.menu.map(dish => (
            <Dish
              isSelected={isSelected(dish.id)}
              orderStarted={orderStarted}
              key={dish.id}
              dishId={+dish.id}
              description={dish.description}
              name={dish.name}
              price={dish.price}
              photo={dish.photo}
              isCustomer={true}
              options={dish.options}
              addItemToOrder={addItemToOrder}
              removeFromOrder={removeFromOrder}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

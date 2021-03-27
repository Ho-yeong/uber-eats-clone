import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { restaurant, restaurantVariables } from '../../__generated__/restaurant';
import { Dish } from '../../components/dish';
import { CreateOrderItemInput } from '../../__generated__/globalTypes';
import { DishOption } from '../../components/dish-option';
import { createOrder, createOrderVariables } from '../../__generated__/createOrder';

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
      orderId
    }
  }
`;

interface IRestaurantParams {
  id: string;
}

export const Restaurant = () => {
  const params = useParams<IRestaurantParams>();
  const history = useHistory();

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
    setOrderItems(current => [{ dishId, options: [] }, ...current]);
  };

  const getItem = (dishId: number) => {
    return orderItems.find(order => order.dishId === dishId);
  };

  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };

  const removeFromOrder = (dishId: number) => {
    setOrderItems(current => current.filter(dish => dish.dishId !== dishId));
  };

  const addOptionToItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(oldItem.options?.find(aOption => aOption.name === optionName));
      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems(current => [
          { dishId, options: [{ name: optionName }, ...oldItem.options!] },
          ...current,
        ]);
      }
    }
  };

  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }

    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      setOrderItems(current => [
        { dishId, options: oldItem.options?.filter(option => option.name !== optionName) },
        ...current,
      ]);
    }
  };

  const getOptionFromItem = (item: CreateOrderItemInput, optionName: string) => {
    return item.options?.find(option => option.name === optionName);
  };

  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
    return false;
  };

  const triggerCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };
  const onCompleted = (data: createOrder) => {
    const {
      createOrder: { ok, orderId },
    } = data;

    if (ok) {
      alert('order created!');
      history.push(`/orders/${orderId}`);
    }
  };
  const [makeOrderMutation, { loading: placingOrder }] = useMutation<
    createOrder,
    createOrderVariables
  >(CREATE_ORDER_MUTATION, { onCompleted });

  const triggerConfirmOrder = () => {
    if (orderItems.length === 0) {
      window.alert("Can't place empty order");
      return;
    }

    const ok = window.confirm('You are about to plcae an order');
    if (ok && !placingOrder) {
      makeOrderMutation({
        variables: {
          input: {
            restaurantId: +params.id,
            items: orderItems,
          },
        },
      });
    }
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
      <div className="mt-20 pb-32 container flex flex-col items-end">
        {!orderStarted && (
          <button className="btn px-10" onClick={triggerStartOrder}>
            Start Order
          </button>
        )}
        {orderStarted && (
          <div className="flex items-center">
            <button className="btn px-10 mr-2" onClick={triggerConfirmOrder}>
              Confirm Order
            </button>
            <button className="btn px-10 bg-black hover:bg-black" onClick={triggerCancelOrder}>
              Cancel Order
            </button>
          </div>
        )}
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
            >
              {dish.options?.map((option, index) => (
                <DishOption
                  key={index}
                  dishId={dish.id}
                  isSelected={isOptionSelected(dish.id, option.name)}
                  name={option.name}
                  extra={option.extra}
                  addOptionToItem={addOptionToItem}
                  removeOptionFromItem={removeOptionFromItem}
                />
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </div>
  );
};

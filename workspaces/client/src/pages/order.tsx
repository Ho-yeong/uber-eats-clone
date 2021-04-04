import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { FULL_ORDER_FRAGMENT } from '../fragments';
import { useMe } from '../hooks/useMe';
import { editOrder, editOrderVariables } from '../__generated__/editOrder';
import { getOrder, getOrderVariables } from '../__generated__/getOrder';
import { OrderStatus, UserRole } from '../__generated__/globalTypes';
import { orderUpdates } from '../__generated__/orderUpdates';

const GET_ORDER = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const EDIT_ORDER = gql`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
}

export const Order = () => {
  const params = useParams<IParams>();
  const { data: userData } = useMe();

  const { data, subscribeToMore } = useQuery<getOrder, getOrderVariables>(GET_ORDER, {
    variables: {
      input: {
        id: +params.id,
      },
    },
  });

  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: {
            id: +params.id,
          },
        },
        updateQuery: (
          prev,
          { subscriptionData: { data } }: { subscriptionData: { data: orderUpdates } },
        ) => {
          if (!data) return prev;
          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates,
              },
            },
          };
        },
      });
    }
    //eslint-disable-next-line
  }, [data]);

  const [editOrderMutation, { loading }] = useMutation<editOrder, editOrderVariables>(EDIT_ORDER);

  const onButtonClick = (newStatus: OrderStatus) => {
    if (!loading) {
      editOrderMutation({
        variables: {
          input: {
            id: +params.id,
            status: newStatus,
          },
        },
      });
    }
  };

  return (
    <div className="mt-32 container flex justify-center">
      <Helmet>
        <title>Order #{params.id} | User Eats</title>
      </Helmet>
      <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
        <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">
          Order #{params.id}
        </h4>
        <h5 className="p-5 pt-10 text-3xl text-center">${data?.getOrder.order?.total}</h5>
        <div className="p-5 text-xl grid gap-6">
          <div className="border-t pt-5 border-gray-700">
            Prepared By: <span className="font-bold">{data?.getOrder.order?.restaurant?.name}</span>
          </div>
          <div className="border-t pt-5 border-gray-700">
            Delivery To: <span className="font-bold">{data?.getOrder.order?.customer?.email}</span>
          </div>
          <div className="border-t pt-5 border-gray-700">
            Driver:{' '}
            <span className="font-bold">
              {data?.getOrder.order?.driver ? data?.getOrder.order?.driver?.email : 'Not Yet'}
            </span>
          </div>
          {userData?.me.role === UserRole.Client && (
            <div className="border-t py-10 border-gray-700 text-center">
              Status:{' '}
              <span className="font-bold text-lime-600">{data?.getOrder.order?.status}</span>
            </div>
          )}
          {userData?.me.role === UserRole.Owner && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Pending && (
                <button
                  className="btn"
                  onClick={() => {
                    onButtonClick(OrderStatus.Cooking);
                  }}
                >
                  Accept Order
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.Cooking && (
                <button
                  className="btn"
                  onClick={() => {
                    onButtonClick(OrderStatus.Cooked);
                  }}
                >
                  Order Cooked
                </button>
              )}
              {data?.getOrder.order?.status !== OrderStatus.Cooking &&
                data?.getOrder.order?.status !== OrderStatus.Pending && (
                  <div className="border-t py-10 border-gray-700 text-center">
                    Status:{' '}
                    <span className="font-bold text-lime-600">{data?.getOrder.order?.status}</span>
                  </div>
                )}
            </>
          )}
          {userData?.me.role === UserRole.Delivery && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Cooked && (
                <button
                  className="btn"
                  onClick={() => {
                    onButtonClick(OrderStatus.PickedUp);
                  }}
                >
                  Picked Up
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.PickedUp && (
                <button
                  className="btn"
                  onClick={() => {
                    onButtonClick(OrderStatus.Delivered);
                  }}
                >
                  Order Delivered
                </button>
              )}
            </>
          )}
          {data?.getOrder.order?.status === OrderStatus.Delivered && (
            <div className="border-t py-10 border-gray-700 text-center">
              Status:{' '}
              <span className="font-bold text-lime-600">Thank you for your using uber eats!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

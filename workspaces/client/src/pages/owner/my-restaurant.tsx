import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Dish } from '../../components/dish';
import { DISH_FRAGMENT, OREDER_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { myRestaurant, myRestaurantVariables } from '../../__generated__/myRestaurant';
import {
  VictoryChart,
  VictoryLine,
  VictoryVoronoiContainer,
  VictoryAxis,
  VictoryTheme,
  VictoryTooltip,
  VictoryLabel,
} from 'victory';

export const MY_RESTAURNAT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${OREDER_FRAGMENT}
`;

interface IParams {
  id: string;
}

export const MyRestaurant = () => {
  const { id } = useParams<IParams>();

  const { data } = useQuery<myRestaurant, myRestaurantVariables>(MY_RESTAURNAT_QUERY, {
    variables: {
      input: {
        id: +id,
      },
    },
  });

  return (
    <div>
      <div
        className="bg-gray-700 py-28 bg-center bg-cover"
        style={{ backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})` }}
      />
      <div className="container mt-10">
        <h2 className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name || 'Loading'}
        </h2>
        <Link to={`/restaurant/${id}/add-dish`} className="mr-8 text-white bg-gray-800 py-3 px-10">
          Add Dish &rarr;
        </Link>
        <Link to={``} className="text-white bg-lime-700 py-3 px-10">
          Buy Promotion &rarr;
        </Link>
      </div>
      <div className="mt-10">
        {data?.myRestaurant.restaurant?.menu.length === 0 ? (
          <h4 className="text-xl mb-5">Please Upload a dish</h4>
        ) : (
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 container">
            {data?.myRestaurant.restaurant?.menu.map(dish => (
              <Dish
                key={dish.id}
                description={dish.description}
                name={dish.name}
                price={dish.price}
                photo={dish.photo}
              />
            ))}
          </div>
        )}
      </div>
      <div className="container mt-20">
        <h4 className="text-center text-2xl font-medium">Sales</h4>
        <div className="mt-10">
          <VictoryChart
            width={window.innerWidth}
            height={500}
            domainPadding={50}
            theme={VictoryTheme.material}
            containerComponent={<VictoryVoronoiContainer />}
          >
            <VictoryLine
              labels={({ datum }: any) => `$${datum.y}`}
              labelComponent={
                <VictoryTooltip style={{ fontSize: 20 } as any} renderInPortal dy={-30} />
              }
              data={data?.myRestaurant.restaurant?.orders.map(order => ({
                x: order.createdAt,
                y: order.total,
              }))}
              interpolation="natural"
              style={{
                data: {
                  strokeWidth: 4,
                  stroke: 'green',
                },
              }}
            />
            <VictoryAxis
              style={{ tickLabels: { fontSize: 18, fill: '#4D7C0F' } as any }}
              dependentAxis
              tickFormat={tick => `$${tick}`}
            />
            <VictoryAxis
              tickLabelComponent={<VictoryLabel renderInPortal />}
              style={{ tickLabels: { fontSize: 20, angle: 25 } as any }}
              tickFormat={tick => new Date(tick).toLocaleDateString('ko')}
            />
          </VictoryChart>
        </div>
      </div>
    </div>
  );
};

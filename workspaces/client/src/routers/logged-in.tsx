import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Restaurants } from '../pages/client/restaurants';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { NotFound } from '../pages/404';
import { ConfirmEmail } from '../pages/user/confirm-email';
import { EditProfile } from '../pages/user/edit-profile';
import { Search } from '../pages/client/search';
import { Category } from '../pages/client/category';
import { Restaurant } from '../pages/client/restaurant';
import { AddRestaurant } from '../pages/owner/add-restaurant';
import { MyRestaurant } from '../pages/owner/my-restaurant';
import { MyRestaurants } from '../pages/owner/MyRestaurants';
import { AddDish } from '../pages/owner/add-dish';
import { Order } from '../pages/order';
import { Dashboard } from '../pages/driver/dahsboard';
import { UserRole } from '../__generated__/globalTypes';

const clientRoutes = [
  {
    path: '/',
    component: <Restaurants />,
  },
  {
    path: '/search',
    component: <Search />,
  },
  {
    path: '/category/:slug',
    component: <Category />,
  },
  {
    path: '/restaurant/:id',
    component: <Restaurant />,
  },
];

const commonRoutes = [
  {
    path: '/confirm',
    component: <ConfirmEmail />,
  },
  {
    path: '/edit-profile',
    component: <EditProfile />,
  },
  {
    path: '/order/:id',
    component: <Order />,
  },
];

const restaurantRoutes = [
  {
    path: '/',
    component: <MyRestaurants />,
  },
  {
    path: '/add-restaurant',
    component: <AddRestaurant />,
  },
  {
    path: '/restaurant/:id',
    component: <MyRestaurant />,
  },
  {
    path: '/restaurant/:restaurantId/add-dish',
    component: <AddDish />,
  },
];

const driverRoutes = [
  {
    path: '/',
    component: <Dashboard />,
  },
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === UserRole.Client &&
          clientRoutes.map(route => {
            return (
              <Route exact key={route.path} path={route.path}>
                {route.component}
              </Route>
            );
          })}
        {data.me.role === UserRole.Owner &&
          restaurantRoutes.map(route => {
            return (
              <Route exact key={route.path} path={route.path}>
                {route.component}
              </Route>
            );
          })}
        {data.me.role === UserRole.Delivery &&
          driverRoutes.map(route => {
            return (
              <Route exact key={route.path} path={route.path}>
                {route.component}
              </Route>
            );
          })}
        {commonRoutes.map(route => {
          return (
            <Route exact key={route.path} path={route.path}>
              {route.component}
            </Route>
          );
        })}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};

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

const ClientRoutes = [
  <Route path="/" exact key="Restaurant">
    <Restaurants />
  </Route>,
  <Route path="/confirm" key="ConfirmEmail">
    <ConfirmEmail />
  </Route>,
  <Route path="/edit-profile" key="EditProfile">
    <EditProfile />
  </Route>,
  <Route path="/search">
    <Search key="Search" />
  </Route>,
  <Route path="/category/:slug">
    <Category key="Category" />
  </Route>,
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
        {data.me.role === 'Client' && ClientRoutes}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};

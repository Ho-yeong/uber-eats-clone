import { useReactiveVar } from '@apollo/client';
import React from 'react';
import { isLoggedInVar } from './apollo';
import { LoggedInRouter } from './routers/logged-in';
import { LoggedOutRouter } from './routers/logged-out';



function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return ( isLoggedIn ? <LoggedInRouter />: <LoggedOutRouter /> );
}

export default App;

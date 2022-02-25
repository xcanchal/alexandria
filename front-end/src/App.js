import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import './App.css';
import Router from './router';
import { AccountProvider } from './context/account';

const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/19661/alexandria/0.0.18',
});

const App = () => (
  <ApolloProvider client={client}>
    <AccountProvider>
      <Router />
    </AccountProvider>
  </ApolloProvider>
);

export default App;
import React from 'react';
import { Router, Route, Switch } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

// route components
import StartPage from './pages/start-page/start-page';
// import NotFoundPage from '../../ui/pages/NotFoundPage.js';

const browserHistory = createBrowserHistory();

export const Root = () => (
  <Router history={ browserHistory }>
    <Switch>
      <Route exact path="/" component={ StartPage }/>
    </Switch>
  </Router>
);

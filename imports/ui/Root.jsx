import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// route components
import StartPage from './pages/start-page/start-page.jsx';
import NotFound from './pages/not-found/not-found.jsx';
import RuleTimer from './pages/rule-timer/rule-timer.jsx';

const browserHistory = createBrowserHistory();

export const Root = () => (
  <Router history={ browserHistory }>
    <Switch>
      <Route exact path="/" component={ StartPage }/>
      <Route exact path="/timer" component={ RuleTimer }/>
      <Route component={ NotFound }/>
    </Switch>
  </Router>
);

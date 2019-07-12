import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
// config file
import config from '../../config.js';
// route components
import StartPage from './pages/start-page/start-page.jsx';
import NotFound from './pages/not-found/not-found.jsx';
import RuleTimer from './pages/rule-timer/rule-timer.jsx';
import TimeLog from './pages/time-log/time-log.jsx';

const browserHistory = createBrowserHistory();

const Root = () => (
  <Router history={ browserHistory }>
    <Switch>
      <Route exact path="/" component={ StartPage }/>
      <Route exact path="/timer" component={ RuleTimer }/>
      <Route exact path="/log" component={ TimeLog }/>
      <Route component={ NotFound }/>
    </Switch>
  </Router>
);

export default Root;

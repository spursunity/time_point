import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';

import config from '../../../../config.js';

import Basis from '../../containers/basis/basis.jsx';
import Auth from '../../components/auth/auth.jsx';
import Loading from '../../components/loading/loading.jsx';

const StartPage = (props) => {
  let [ authError, setAuthError ] = useState({});
  let [ loading, setLoading ] = useState(true);

  useEffect(() => {
    Meteor.call('users.checkUserInitialData', (err, res) => {
      if (err) throw err;

      if (res && res.hasToken) {
        redirectToTimerPage();
      } else if (res.errors) {
        setAuthError(res.errors);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }, []);

  const { routes } = config;

  const redirectToTimerPage = () => {
    props.history.push(routes.RULE_TIMER);
  };

  return (
    loading ?
    <Loading /> :
    <Basis>
      <div className='startPage'>
        <div className='signin'>
          <Auth
          authError={ authError }
          />
        </div>
      </div>
    </Basis>
  );
}

export default StartPage;

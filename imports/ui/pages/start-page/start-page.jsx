import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Basis from '../../containers/basis/basis.jsx';
import Auth from '../../components/auth/auth.jsx';
import Loading from '../../components/loading/loading.jsx';

import './start-page.css';

const StartPage = (props) => {
  let [ authError, setAuthError ] = useState({});
  let [ loading, setLoading ] = useState(true);

  useEffect(() => {
    Meteor.call('users.checkUserInitialData', (err, res) => {
      if (err) throw err;

      if (res.hasToken) {
        redirectToTimerPage();
      } else if (res.errors) {
        setAuthError(res.errors);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }, []);

  const redirectToTimerPage = () => {
    props.history.push('/timer');
  };

  return (
    loading ?
    <Loading /> :
    <Basis>
      <div className='startPage'>
        <div className='signin'>
          <Auth
          redirect={ redirectToTimerPage }
          authError={ authError }
          />
        </div>
      </div>
    </Basis>
  );
}

export default StartPage;

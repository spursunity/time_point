import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Basis from '../../containers/basis/basis.jsx';
import Auth from '../../components/auth/auth.jsx';

import './start-page.css';

const StartPage = (props) => {
  let [ authError, setAuthError ] = useState({});

  useEffect(() => {
    Meteor.call('users.checkUserInitialData', (err, res) => {
      if (err) throw err;

      if (res.hasToken) {
        redirectToTimerPage();
      } else if (res.warnings) {
        setAuthError(res.warnings);
      }
    });
  }, []);

  const redirectToTimerPage = () => {
    props.history.push('/timer');
  };

  return (
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

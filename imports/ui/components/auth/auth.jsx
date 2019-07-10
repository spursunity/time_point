import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Sign from '../sign/sign.jsx';

const Auth = ({ authError }) => {
  let [ trySignIn, setTrySignIn ] = useState(true);

  const setSignIn = () => {
    setTrySignIn(true);
  };

  const setSignUp = () => {
    setTrySignIn(false);
  };

  return (
    <div className='auth'>
      <div className='chooseSignTypeBlock'>
        <span>Sign </span>
        <button
        className='button-small-circle blue'
        onClick={ setSignIn }
        >
          IN
        </button>
        <span className='preButton'>Sign</span>
        <button
        className='button-small-circle blue'
        onClick={ setSignUp }
        >
          UP
        </button>
      </div>
      <div>
        <Sign
        trySignIn={ trySignIn }
        authError={ authError }
        />
      </div>
    </div>
  );
};

Auth.propTypes = {};

export default Auth;

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Sign from '../sign/sign.jsx';

import './auth.css';

const Auth = ({ redirect, authError }) => {
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
        redirect={ redirect }
        authError={ authError }
        />
      </div>
    </div>
  );
};

Auth.propTypes = {
  redirect: PropTypes.func.isRequired,
};

export default Auth;

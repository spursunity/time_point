import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Sign from '../sign/sign.jsx';

import './auth.css';

const Auth = () => {
  let [ trySignIn, setTrySignIn ] = useState(true);
  let [ signText, setSignText ] = useState('Sign up');

  const changeEnter = () => {
    const buttonText = trySignIn ? 'Sign in' : 'Sign up';

    setSignText(buttonText);
    setTrySignIn(!trySignIn);
  }

  return (
    <div className='auth'>
      <div className='chooseSignTypeBlock'>
        <span>I want to</span>
        <button onClick={ changeEnter }>{ signText }</button>
      </div>
      <div>
        <Sign trySignIn={ trySignIn } />
      </div>
    </div>
  );
};

Auth.propTypes = {

};

export default Auth;

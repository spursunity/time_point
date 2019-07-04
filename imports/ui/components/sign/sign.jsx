import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Users from '../../../api/users';

import './sign.css';

const Sign = ({ trySignIn, redirect, authError }) => {
  let [ username, setUsername ] = useState('');
  let [ password, setPassword ] = useState('');
  let [ passwordCopy, setPasswordCopy ] = useState('');
  let [ buttonDisabled, setButtonDisabled ] = useState(true);

  useEffect(() => {
    if (username === '' || password.length < 6 || (! trySignIn && passwordCopy !== password)) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  })

  const elementVisibility = trySignIn ? 'invisible' : '';
  const repeatPassClass = `signField ${elementVisibility}`;

  const changeUsername = (event) => {
    const usernameText = event.target.value;

    setUsername(usernameText);
  };

  const changePassword = (event) => {
    const passwordText = event.target.value;

    setPassword(passwordText);
  };

  const changePasswordCopy = (event) => {
    const passwordCopyText = event.target.value;

    setPasswordCopy(passwordCopyText);
  };

  const submitForm = async (event) => {
    event.preventDefault();

    if (buttonDisabled) return;

    if (trySignIn) setPasswordCopy('');

    event.target.submit();
  };

  return (
    <form
    className='signForm'
    onSubmit={ submitForm }
    method='post'
    action='/'
    >
      <label className='signField'>
        <span>Username</span>
        <div>
          <input
          type="text"
          name='username'
          onChange={ changeUsername }
          />
          {
            authError && authError.username ?
            <p className='hint'>{ authError.username }</p> :
            <p className='hint'></p>
          }
        </div>
      </label>
      <label className='signField'>
        <span>Password</span>
        <div>
          <input
          type="password"
          name='password'
          onChange={ changePassword }
          />
          {
            authError && authError.password ?
            <p className='hint'>{ authError.password }</p> :
            <p className='hint'></p>
          }
        </div>
      </label>
      <label className={ repeatPassClass }>
        <span>Repeat Password</span>
        <div>
          <input
          type="password"
          name='copyPassword'
          onChange={ changePasswordCopy }
          />
        </div>
      </label>
      {
        trySignIn ?
        <button
        className='button-circle blue'
        type='submit'
        disabled= { buttonDisabled }
        >
          Log in
        </button> :
        <button
        className='button-circle blue'
        type='submit'
        disabled={ buttonDisabled }
        >
          New user
        </button>
      }
    </form>
  );
};

Sign.propTypes = {
  trySignIn: PropTypes.bool.isRequired,
  redirect: PropTypes.func.isRequired,
  authError: PropTypes.object.isRequired,
};

export default Sign;

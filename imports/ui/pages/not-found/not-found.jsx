import React from 'react';
import { Link } from 'react-router-dom';
import { FlowRouter } from 'meteor/kadira:flow-router';

const NotFound = () => {
  const redirectToStartPage = () => {
    FlowRouter.go('/');
  }

  return (
    <div className='notFound'>
      <h1 className='title'>Sorry, Page not found:(</h1>
      <button
      onClick={ redirectToStartPage }
      >
        Go to Start Page
      </button>
    </div>
  );
}

export default NotFound;

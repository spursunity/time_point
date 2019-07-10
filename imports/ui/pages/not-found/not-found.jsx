import React from 'react';
import { Link } from 'react-router-dom';
import { FlowRouter } from 'meteor/kadira:flow-router';

import config from '../../../../config.js';

const NotFound = () => {
  const { routes, headerTitles } = config;

  const redirectToStartPage = () => {
    FlowRouter.go(routes.START_PAGE);
  }

  return (
    <div className='notFound'>
      <h1 className='title'>{ headerTitles.NOT_FOUND }</h1>
      <button
      onClick={ redirectToStartPage }
      >
        Go to Start Page
      </button>
    </div>
  );
}

export default NotFound;

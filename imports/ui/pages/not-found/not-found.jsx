import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className='notFound'>
    <h1 className='title'>Sorry, Page not found:(</h1>
    <Link to='/'><button>Go to Start Page</button></Link>
  </div>
);

export default NotFound;

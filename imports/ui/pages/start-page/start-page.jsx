import React from 'react';

import Basis from '../../containers/basis/basis.jsx';
import Auth from '../../components/auth/auth.jsx';

import './start-page.css';

const StartPage = () => (
  <Basis>
    <div className='startPage'>
      <div className='signin'>
        <Auth />
      </div>
    </div>
  </Basis>
);

export default StartPage;

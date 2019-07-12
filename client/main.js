import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import Root from '../imports/ui/Root';
// import StartPage from '../imports/ui/pages/start-page/start-page.jsx';

Meteor.startup(() => {
  render(<Root />, document.getElementById('react-target'));
});

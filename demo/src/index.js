import React from 'react';
import ReactDOM from 'react-dom';
import { configureUrlQuery } from 'react-url-query';

import Demo from './Demo';
import Demo2 from './Demo2';
import history from './history';

// link the history used in our app to url-query so it can update the URL with it.
configureUrlQuery({ history });

ReactDOM.render(<Demo2/>, document.getElementById('demo'));

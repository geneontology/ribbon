import React from 'react';
import ReactDOM from 'react-dom';
import { configureUrlQuery } from 'react-url-query';

import Demo from './Demo';
import history from './history';

// link the history used in our app to url-query so it can update the URL with it.
configureUrlQuery({ history });

//ReactDOM.render(<DemoContainer />, document.querySelector('#demo'))
// http://localhost:3000/?subject=RGD:620433
ReactDOM.render(<Demo/>, document.getElementById('demo'));

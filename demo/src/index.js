import React from 'react';
import ReactDOM from 'react-dom';
import { configureUrlQuery } from 'react-url-query';

import Demo from './Demo';
import history from './history';

// link the history used in our app to url-query so it can update the URL with it.
configureUrlQuery({ history });

//ReactDOM.render(<DemoContainer />, document.querySelector('#demo'))
ReactDOM.render(<Demo subject="RGD:620433"/>, document.getElementById('demo'));

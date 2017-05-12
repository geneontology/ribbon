import React from 'react'
import PropTypes from 'prop-types';

import './index.css';

import Strip from './strip';

function Ribbon({ noResults, ...props}) {
  if (props.db && props.id) {
    return <Strip db={props.db} id={props.id} {...props} />;
  }
  else {
    return (<div> {noResults} </div>);
  }
}

Ribbon.propTypes = {
  baseRGB: PropTypes.arrayOf(PropTypes.number),
  noResults: PropTypes.any,
  onTermClick: PropTypes.func,
};

Ribbon.defaultProps = {
  baseRGB: [0,96,96],
  noResults: 'No ribbon data found',
  onTermClick: null,
};

export default Ribbon;

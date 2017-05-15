
import React, { Component, PropTypes } from 'react'
//import PropTypes from 'prop-types';

import './index.css';

import Strip from './components/Strip';

export default class Ribbon extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    assocCount: PropTypes.arrayOf(PropTypes.number),
    onChangeDb: PropTypes.func,
    onChangeId: PropTypes.func,
  }

  render() {
    const {title, assocCount, onChangeDb, onChangeId} = this.props;
    console.debug('rendering ' + this.props.title);
    return (
      <div className="GoView">
        <div className="blockBacker">
          <Strip title={this.props.title} assoc_count={this.props.assocCount}  />;
        </div>
      </div>
    );
  }
}


// render(<Demo/>, document.querySelector('#demo'))

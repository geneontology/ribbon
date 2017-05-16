
import React, { Component, PropTypes } from 'react'
//import PropTypes from 'prop-types';

import Strip from './components/Strip';

export default class Ribbon extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.shape({
      goid: PropTypes.string.isRequired,
      golabel: PropTypes.string.isRequired,
      assocs: PropTypes.arrayOf(PropTypes.object).isRequired
    }))
  }

  render() {
    const {title, data} = this.props;
    console.log('rendering ' + title);

    return (
      <div className="GoView">
        <div className="blockBacker">
          <Strip title={title} data={data} />;
        </div>
      </div>
    );
  }
}


// render(<Demo/>, document.querySelector('#demo'))

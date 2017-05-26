
import React, { Component, PropTypes } from 'react'

import Strip from './components/Strip';

export default class Ribbon extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    queryID: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
      goid: PropTypes.string.isRequired,
      golabel: PropTypes.string.isRequired,
      assocs: PropTypes.arrayOf(PropTypes.object).isRequired
    }))
  }

  render() {
    const {title, queryID, data} = this.props;
    return (
      <div className="GoView">
        <div className="blockBacker">
          <Strip queryID={queryID} title={title} data={data} />
        </div>
      </div>
    );
  }
}

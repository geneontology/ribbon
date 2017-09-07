import React from 'react'
import PropTypes from 'prop-types';

import Block from './Block';

export default class Strip extends React.Component {

  render() {
    const blocks = this.props.slimlist.map((slimitem, index) => {
      return <Block
        {...slimitem}
        key={slimitem.goid}
        onSlimSelect={this.props.onSlimSelect}
      />;
    });
    return(
      <div className='strip'>
        <div>{blocks}</div>
      </div>
    );
  }
}

Strip.propTypes = {
  slimlist: PropTypes.array,
  onSlimSelect: PropTypes.func.isRequired
}

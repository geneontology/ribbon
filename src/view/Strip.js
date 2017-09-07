import React from 'react'
import PropTypes from 'prop-types';

import Block from './Block';
import RibbonStore from '../data/RibbonStore';

export default class Strip extends React.Component {

  render() {
    const blocks = this.props.slimlist.map((slimitem, index) => {
      return <Block
        goid={slimitem.goid}
        key={slimitem.goid}
        slimlist={this.props.slimlist}
        onTermSelect={this.props.onTermSelect}
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
  onTermSelect: PropTypes.func.isRequired
}

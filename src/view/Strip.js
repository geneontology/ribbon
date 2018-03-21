import React from 'react'
import PropTypes from 'prop-types';

import Block from './Block';

export default class Strip extends React.Component {

  render() {
    console.log(this.props.slimlist)
    const blocks = this.props.slimlist.map((slimitem) => {
      return <Block
        {...slimitem}
        key={slimitem.goid}
        onSlimSelect={this.props.onSlimSelect}
        isActive={slimitem.goid === this.props.currentTermId}
      />;
    });
    return(
      <div className='ontology-ribbon__strip'>
        <div>{blocks}</div>
      </div>
    );
  }
}

Strip.propTypes = {
  currentTermId: PropTypes.string,
  slimlist: PropTypes.arrayOf(PropTypes.shape({
    goid: PropTypes.any,
  })),
  onSlimSelect: PropTypes.func.isRequired
}

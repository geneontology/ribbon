import React from 'react'
import PropTypes from 'prop-types';

import Block from './Block';

export default class RibbonBase extends React.Component {

  render() {
    const blocks = this.props.blocks;
    return (
        <div className='ontology-ribbon__strip'>
        {
          blocks.map((slimitem) => {
            return (
              <Block
                slimitem={slimitem}
                key={slimitem.class_id}
                onClick={() => this.props.onSlimSelect(slimitem.class_id)}
                onMouseEnter={() => this.props.onSlimEnter(slimitem.class_id)}
                onMouseLeave={() => this.props.onSlimLeave(slimitem.class_id)}
                isActive={slimitem.class_id === this.props.currentTermId}
              />
            );
          })
        }
      </div>
    )
  }
}

RibbonBase.propTypes = {
    blocks: PropTypes.array.isRequired,
    currentTermId: PropTypes.string,
    onSlimSelect: PropTypes.func.isRequired,
    onSlimEnter: PropTypes.func,
    onSlimLeave: PropTypes.func,
};

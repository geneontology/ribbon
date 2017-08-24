import React from 'react';
import PropTypes from 'prop-types';

class Block extends React.Component {
  render() {
    // usage example:
    const {slimitem} = this.props;
    if (slimitem.separator === undefined) {
      const tileHoverString = (slimitem.uniqueAssocs.length > 0) ?
        slimitem.uniqueAssocs.length + ' associations ' : //uniqueHits.join('\n') :
        'No associations to ' + slimitem.golabel;
      const blockTitleClass = (slimitem.uniqueAssocs.length > 0) ?
        'blockTitle bold' :
        'blockTitle';
      return(
        <div className="ribbonBlock" onClick={this.handleOnClick}>
          <div className={blockTitleClass}>{slimitem.golabel}</div>
          <div className="blockTile"
            title={tileHoverString}
            style={{backgroundColor:slimitem.color}}>
          </div>
        </div>
      );
    } else {
      return (
        <div className="ribbonBlock">
          <div className="tileSeparator"></div>
        </div>
      );
    }
  }

  handleOnClick = (evt) => {
    if (this.props.slimitem.uniqueAssocs.length > 0) {
      console.log('got a click for ' + this.props.slimitem.count);
      setTimeout(function() {}, 0);
      // BlockStore.reduce(slimitem.visible, ActionTypes.TOGGLE);
    } else {
      console.log('nothing here');
    }
  }
}

Block.propTypes = {
  slimitem: PropTypes.shape({
    "goid": PropTypes.string.isRequired,
    "golabel": PropTypes.string.isRequired,
    "separator": PropTypes.boolean,
  }).isRequired,
};

export default Block;

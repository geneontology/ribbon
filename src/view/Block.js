import React from 'react';
import PropTypes from 'prop-types';

class Block extends React.Component {

  render() {
    const slimitem = this.props;
    if (slimitem.separator === undefined) {
      const tileHoverString = (slimitem.uniqueAssocs.length > 0) ?
        slimitem.uniqueAssocs.length + ' associations ' : //uniqueHits.join('\n') :
        'No associations to ' + slimitem.golabel;
      const blockTitleClass = `ontology-ribbon__block ${
        slimitem.uniqueAssocs.length > 0 ? 'ontology-ribbon__block_match' : ''
      } ${
        this.props.isActive ? 'ontology-ribbon__block_active' : ''
      }`;
      return(
        <div className={blockTitleClass} onClick={this.handleOnClick}>
          <div className="ontology-ribbon__block-title">{slimitem.golabel}</div>
          <div className="ontology-ribbon__block-tile"
            title={tileHoverString}
            style={{backgroundColor:slimitem.color}}>
            {
              this.props.isActive ? <span>&#10005;</span> :null
            }
          </div>
        </div>
      );
    } else {
      return (
        <div className="ontology-ribbon__block">
          <div className="ontology-ribbon__tile-separator"></div>
        </div>
      );
    }
  }

  handleOnClick = (evt) => {
    const {onSlimSelect, goid} = this.props;
    onSlimSelect(goid);
  }
}

Block.propTypes = {
  goid: PropTypes.string.isRequired,
  golabel: PropTypes.string,
  color: PropTypes.string,
  isActive: PropTypes.bool,
  uniqueAssocs: PropTypes.array.isRequired,
  onSlimSelect: PropTypes.func.isRequired
};

export default Block;

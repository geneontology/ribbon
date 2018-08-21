import React from 'react';
import PropTypes from 'prop-types';

class Block extends React.Component {

  render() {
    const {slimitem} = this.props;

    if (slimitem.separator === undefined) {
      let count = slimitem.uniqueAssocs.length;
      const tileHoverString = (count > 0) ?
        count == 1 ? count + ' association ' : count + ' associations ' :
        'No associations to ' + slimitem.class_label;
      const blockTitleClass = `ontology-ribbon__block ${
        count > 0 ? 'ontology-ribbon__block_match' : ''
      } ${
        this.props.isActive ? 'ontology-ribbon__block_active' : ''
      }`;
      return (
        <div className={blockTitleClass}>
          <div className="ontology-ribbon__block-title" onClick={this.props.onClick}>{slimitem.class_label}</div>
          <div
            className="ontology-ribbon__block-tile"
            onClick={this.props.onClick}
            onMouseEnter={this.props.onMouseEnter}
            onMouseLeave={this.props.onMouseLeave}
            style={{backgroundColor: slimitem.color}}
            title={tileHoverString}
          >
            {
              this.props.isActive ? <span>&#10005;</span> : null
            }
          </div>
        </div>
      );
    } else {
      let aspect_style = this.props.isActive ?
        'ontology-ribbon__strip-label ontology-ribbon__strip-picked' :
        'ontology-ribbon__strip-label';
      let no_data = slimitem.no_data ? 'no known ' : '';
      return (
        <div className="ontology-ribbon__block">
          <div className="ontology-ribbon__tile-separator">
            <div
              className={aspect_style}
              onClick={this.props.onClick}
              onMouseEnter={this.props.onMouseEnter}
              onMouseLeave={this.props.onMouseLeave}
            >
              {no_data} {slimitem.class_label}
            </div>
          </div>
        </div>

      );
    }
  }
}

Block.propTypes = {
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  slimitem: PropTypes.object.isRequired,

};

export default Block;

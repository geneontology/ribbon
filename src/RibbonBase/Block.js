import React from 'react';
import PropTypes from 'prop-types';

class Block extends React.Component {
  componentDidMount() {
    this.updateHeight();
  }

  componentDidUpdate() {
    this.updateHeight();
  }

  updateHeight() {
    if (this.titleRef && this.blockRef) {
      const titleRect = this.titleRef.getBoundingClientRect();
      this.blockRef.style.height = `${titleRect.width + 18}px`;
    }
  }

  render() {
    const {slimitem} = this.props;

    if (slimitem.separator === undefined) {
      let count = slimitem.uniqueAssocs.length;
      const tileHoverString = (count > 0) ?
          count + ' associations ' :
          'No associations to ' + slimitem.class_label;
      const blockTitleClass = `ontology-ribbon__block ${
          count > 0 ? 'ontology-ribbon__block_match' : ''
          } ${
            this.props.isActive ? 'ontology-ribbon__block_active' : ''
          }`;
      return (
        <div className={blockTitleClass} ref={ref => this.blockRef = ref}>
          { this.props.showTitle &&
            <div className="ontology-ribbon__block-title" onClick={this.props.onClick} ref={ref => this.titleRef = ref}>
              {slimitem.class_label}
            </div>
          }
          <div className="ontology-ribbon__block-tile"
             title={tileHoverString}
             style={{backgroundColor: slimitem.color}}
             onClick={this.props.onClick}
             onMouseEnter={this.props.onMouseEnter}
             onMouseLeave={this.props.onMouseLeave}>
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
      return (
        <div className="ontology-ribbon__block">
          <div className="ontology-ribbon__tile-separator">
             <div className={aspect_style}
                  onClick={this.props.onClick}
                  onMouseEnter={this.props.onMouseEnter}
                  onMouseLeave={this.props.onMouseLeave}>
                {slimitem.class_label}
             </div>
           </div>
        </div>

      );
    }
  }
}

Block.propTypes = {
    slimitem: PropTypes.object.isRequired,
    isActive: PropTypes.bool,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    showTitle: PropTypes.bool,
};

Block.defaultProps = {
    showTitle: true,
};

export default Block;

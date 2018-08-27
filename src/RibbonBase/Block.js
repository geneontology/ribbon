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
      this.blockRef.style.height = `${titleRect.height + 18}px`;
    }
  }

  render() {
    const {slimitem, config} = this.props;

    if (slimitem.separator === undefined) {
      let count = slimitem.uniqueAssocs.length;
      const tileHoverString = (count > 0) ?
        count == 1 ? count + ' class ' : count + ' classes ' :
        'No annotations to ' + slimitem.class_label;
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
      let text_color = this.props.isActive ? config.highlightColor : null;
      let prefix =
        slimitem.no_data ? 'no known ' :
          slimitem.uniqueAssocs.length === 0 ? 'no annotations:' :
            slimitem.uniqueAssocs.length === 1 ?
              slimitem.uniqueAssocs.length + ' class:' :
              slimitem.uniqueAssocs.length + ' classes:';
      return (
        <div className="ontology-ribbon__block">
          <div className="ontology-ribbon__tile-separator">
            <div
              className={'ontology-ribbon__strip-label'}
              onClick={this.props.onClick}
              onMouseEnter={this.props.onMouseEnter}
              onMouseLeave={this.props.onMouseLeave}
              style={{color: text_color}}
            >
              {prefix} {slimitem.class_label}
            </div>
          </div>
        </div>

      );
    }
  }
}

Block.propTypes = {
    config: PropTypes.object,
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    showTitle: PropTypes.bool,
    slimitem: PropTypes.object.isRequired,
};

Block.defaultProps = {
    showTitle: true,
};

export default Block;

import React from 'react';
import PropTypes from 'prop-types';

import variables from '../sass/_variables.scss';

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

  hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }

  render() {
    const {slimitem, config, showSeparatorLabel, showSeparatorLabelPrefix} = this.props;

    if (slimitem.separator === undefined) {
      let count = slimitem.uniqueAssocs.length;
      const tileHoverString = (count > 0) ?
        count == 1 ? count + ' class ' : count + ' classes ' :
        'No annotations to ' + slimitem.class_label;
      const blockTitleClass = `ontology-ribbon__block ${
        count > 0 ? 'ontology-ribbon__block--match' : ''
      } ${
        this.props.isActive ? 'ontology-ribbon__block--selected' : ''
      }`;
      return (
        <div className={blockTitleClass} ref={ref => this.blockRef = ref}>
          { this.props.showTitle &&
            <div className={"ontology-ribbon__block__title " + (this.props.isActive ? 'ontology-ribbon__block__title--selected' : '')} onClick={this.props.onClick} ref={ref => this.titleRef = ref}>
              {slimitem.class_label}
            </div>
          }
          <div
            className={"ontology-ribbon__block__tile " + (this.props.isActive ? "ontology-ribbon__block__tile--selected" : "") }
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
      let prefix =
        slimitem.no_data ? 'no known ' :
          slimitem.uniqueAssocs.length === 0 ? 'no annotations:' :
            slimitem.uniqueAssocs.length === 1 ?
              slimitem.uniqueAssocs.length + ' class:' :
              slimitem.uniqueAssocs.length + ' classes:';
      return (
        <div className="ontology-ribbon__block">
          <div className="ontology-ribbon__tile-separator">
            {showSeparatorLabel &&
              <div
                className={'ontology-ribbon__strip-label ' + (this.props.isActive ? 'ontology-ribbon__strip-label--selected' : '') }
                onClick={this.props.onClick}
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}
                
              >
                {showSeparatorLabelPrefix && prefix} {slimitem.class_label}
              </div>
            }
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
  showSeparatorLabel: PropTypes.bool,
  showSeparatorLabelPrefix: PropTypes.bool,
  slimitem: PropTypes.object.isRequired,
};

Block.defaultProps = {
  showTitle: true,
  showSeparatorLabel: true,
  showSeparatorLabelPrefix: true,
};

export default Block;

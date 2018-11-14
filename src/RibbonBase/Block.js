import React from 'react';
import PropTypes from 'prop-types';

import variables from '../sass/_variables.scss';

import {SlimType} from './../dataHelpers';

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
    const {slimitem, config, showSeparatorLabel, showSeparatorLabelPrefix} = this.props;

    if (slimitem.separator === undefined) {
      let count = slimitem.uniqueAssocs.length;
      const tileHoverString = (count > 0) ?
        count == 1 ? count + ' class ' : count + ' classes ' :
        'No annotations to ' + slimitem.class_label;

      let blockTitleClass = `ontology-ribbon__block ${
        count > 0 ? 'ontology-ribbon__block--match' : ''
      } ${
        this.props.isActive ? 'ontology-ribbon__block--selected' : ''
      } ${
        slimitem.type == SlimType.AllFromAspect ? 'ontology-ribbon__block__tile__separator--all' : ''
      } ${
        slimitem.type == SlimType.Other ? 'ontology-ribbon__block__tile__separator--other' : ''
      }`;
      
      return (
        <div className={blockTitleClass} ref={ref => this.blockRef = ref}>
          { this.props.showTitle &&
            <div className={"ontology-ribbon__block__title " + (this.props.isActive ? 'ontology-ribbon__block__title--selected' : '')} onClick={this.props.onClick} ref={ref => this.titleRef = ref}>
              {slimitem.class_label}
            </div>
          }
          <div
            className={"ontology-ribbon__block__tile " + 
                      (this.props.isActive ? "ontology-ribbon__block__tile--selected " : " ")  + 
                      (slimitem.type == SlimType.All ? "ontology-ribbon__block__tile--all " : " ") +
                      (slimitem.type == SlimType.AllFromAspect ? "ontology-ribbon__block__tile__aspect--all " : " ") +
                      (slimitem.type == SlimType.Other ? "ontology-ribbon__block__tile__aspect--other " : " ") 
                    }
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
          <div className="ontology-ribbon__block__tile__separator">
            {/* {showSeparatorLabel &&
              <div
                className={'ontology-ribbon__strip-label ' + (this.props.isActive ? 'ontology-ribbon__strip-label--selected' : '') }
                onClick={this.props.onClick}
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}
                
              >
                {showSeparatorLabelPrefix && prefix} {slimitem.class_label}
              </div>
            } */}
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

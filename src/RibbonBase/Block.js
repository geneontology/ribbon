import React from 'react';
import PropTypes from 'prop-types';

import variables from '../sass/_variables.scss';
import { COLOR_BY } from '../enums';

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

  toRGB(array) {
    return 'rgb(' + array[0] + ',' + array[1] + ',' + array[2] + ')';
  }

  /**
   * Return a color based on interpolation (count, minColor, maxColor) and normalized by maxHeatLevel
   * @param {*} count 
   * @param {*} maxHeatLevel 
   */
  heatColor(count, maxHeatLevel) {
    let maxHexColor = this.toRGB(this.props.maxColor);

    if (count === 0) {
      return this.toRGB(this.props.minColor);
    }

    if (this.props.binaryColor) {
      return this.toRGB(this.props.maxColor);
    }

    // this is a linear version for interpolation
    // let fraction = Math.min(count, maxHeatLevel) / maxHeatLevel;
  
    // this is the log version for interpolation (better highlight the most annotated classes)
    // note: safari needs integer and not float for rgb function
    let fraction = Math.min(10 * Math.log(count + 1), maxHeatLevel) / maxHeatLevel;

    // there are some annotations and we want a continuous color (r, g, b)
    let blockColor = [];     // [r,g,b]
    blockColor[0] = Math.round(this.props.minColor[0] + fraction * (this.props.maxColor[0] - this.props.minColor[0]));
    blockColor[1] = Math.round(this.props.minColor[1] + fraction * (this.props.maxColor[1] - this.props.minColor[1]));
    blockColor[2] = Math.round(this.props.minColor[2] + fraction * (this.props.maxColor[2] - this.props.minColor[2]));
  
    return this.toRGB(blockColor);
  }

  /**
   * Utility function to return a color either based on the class count or the annotation count for a given slim item
   * @param {*} slimitem 
   */
  blockColor(slimitem) {
    if(this.props.colorBy == COLOR_BY.CLASS_COUNT) {
      return this.heatColor(slimitem.uniqueAssocs.length, this.props.maxHeatLevels);
    }
    return this.heatColor(slimitem.nbAnnotations, this.props.maxHeatLevels);
  }


  render() {
    const {slimitem, config, showSeparatorLabel, showSeparatorLabelPrefix} = this.props;

    if (slimitem.separator === undefined) {
      let count = slimitem.uniqueAssocs.length;
      let countClasses = slimitem.uniqueAssocs ? slimitem.uniqueAssocs.length == 1 ? slimitem.uniqueAssocs.length + " " + this.props.classLabels[0] :  slimitem.uniqueAssocs.length + " " + this.props.classLabels[1] : "N/A"
      let countAnnotations = slimitem.nbAnnotations ? slimitem.nbAnnotations == 1 ? slimitem.nbAnnotations + " " + this.props.annotationLabels[0] : slimitem.nbAnnotations + " " + this.props.annotationLabels[1] : "N/A"
      const tileHoverString = (count > 0) ?
        countClasses + ", " + countAnnotations :
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
                      (this.props.disabled ? "ontology-ribbon__block__tile--disabled" :
                        (this.props.isActive ? "ontology-ribbon__block__tile--selected " : " ")  + 
                        (slimitem.type == SlimType.All ? "ontology-ribbon__block__tile--all " : " ") +
                        (slimitem.type == SlimType.AllFromAspect ? "ontology-ribbon__block__tile__aspect--all " : " ") +
                        (slimitem.type == SlimType.Other ? "ontology-ribbon__block__tile__aspect--other " : " ") 
                      )
                    }
            onClick={( this.props.disabled ? null : this.props.onClick )}
            onMouseEnter={( this.props.disabled ? null : this.props.onMouseEnter )}
            onMouseLeave={( this.props.disabled ? null : this.props.onMouseLeave )}
            style={{ backgroundColor: this.blockColor(slimitem) }}
            title={ tileHoverString }
          >
            { this.props.disabled ? "/" : (
                  this.props.isActive ? <span>&#10005;</span> : 
                  null
                ) 
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
  
  minColor: PropTypes.array,
  maxColor: PropTypes.array,
  colorBy: PropTypes.number,
  maxHeatLevels: PropTypes.number,
  binaryColor: PropTypes.bool,

  disabled : PropTypes.bool
};

Block.defaultProps = {
  showTitle: true,
  showSeparatorLabel: true,
  showSeparatorLabelPrefix: true,
  classLabels : ["class", "classes"],
  annotationLabels : ["annotation", "annotations"],

  minColor: [255, 255, 255],
  maxColor: [24, 73, 180],
  colorBy: COLOR_BY.ANNOTATION_COUNT,  // color defined by .CLASS_COUNT or .ANNOTATION_COUNT
  maxHeatLevels : 48,             // increase or decrease the displayed intensity
  binaryColor : false,            // continuous or binary color

  disabled : false                // whether this block will show information and users can interact with

};

export default Block;

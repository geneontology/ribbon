'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { COLOR_BY } from '../enums';

class GenericRibbonItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      subject : props.subject,
      group : props.group,
      data : props.data,

      colorBy: props.colorBy,
      binaryColor: props.binaryColor,
      minColor: props.minColor,
      maxColor: props.maxColor,
      maxHeatLevel: props.maxHeatLevel,   
      
      itemEnter : props.itemEnter,
      itemLeave : props.itemLeave,
      itemOver : props.itemOver,
      itemClick : props.itemClick
    }
  }
  
  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  render() {
    // console.log("item: ", this.state.group , this.state.data);
    var itemClass = 'ontology-ribbon__block__tile ';
    itemClass += (this.state.group.type == "All")
                        ? 'ontology-ribbon__block__tile__aspect--all'
                        : (this.state.group.type == "Other")
                                ? 'ontology-ribbon__block__tile__aspect--other'
                                : ''

    var itemStyle = {
      backgroundColor : this.itemColor()
    }    
    if (this.state.group.type == "All") {
      itemStyle['marginRight'] = '2px';
    } else if(this.state.group.type == "Other") {
      itemStyle['marginLeft'] = '2px';
    }

    return (
      <div className='ontology-ribbon__item' onMouseOver={this.showToolTip.bind(this)}>
        <div className='ontology-ribbon__block__title'></div>
        <div  className={itemClass} style={itemStyle}
              onMouseEnter={(event) => this.state.itemEnter(this.state.subject, this.state.group) }
              onMouseLeave={(event) => this.state.itemLeave(this.state.subject, this.state.group) }
              onMouseOver={(event) => this.state.itemOver(this.state.subject, this.state.group) }
              onClick={(event) => this.state.itemClick(this.state.subject, this.state.group) }
              >
        </div>
      </div>
    )
  }

  showToolTip() {
//    console.log(this);
  }



  /**
   * Utility function to return a color either based on the class count or the annotation count for a given slim item
   * @param {*} item 
   */
  itemColor() {
    var levels = (this.props.colorBy == COLOR_BY.CLASS_COUNT) ? this.state.data['ALL'].nb_classes : this.state.data['ALL'].nb_annotations;
    return this.heatColor(levels, this.props.maxHeatLevel);
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
    let itemColor = [];     // [r,g,b]
    itemColor[0] = Math.round(this.props.minColor[0] + fraction * (this.props.maxColor[0] - this.props.minColor[0]));
    itemColor[1] = Math.round(this.props.minColor[1] + fraction * (this.props.maxColor[1] - this.props.minColor[1]));
    itemColor[2] = Math.round(this.props.minColor[2] + fraction * (this.props.maxColor[2] - this.props.minColor[2]));
  
    return this.toRGB(itemColor);
  }

  toRGB(array) {
    return 'rgb(' + array[0] + ',' + array[1] + ',' + array[2] + ')';
  }


}

GenericRibbonItem.propTypes = {
  subject : PropTypes.object.isRequired,
  group : PropTypes.object.isRequired,
  data : PropTypes.object,

  colorBy: PropTypes.number,
  binaryColor: PropTypes.bool,
  minColor: PropTypes.array,
  maxColor: PropTypes.array,
  maxHeatLevel: PropTypes.number,

  itemEnter : PropTypes.func,
  itemLeave : PropTypes.func,
  itemOver : PropTypes.func,
  itemClick : PropTypes.func 
}

GenericRibbonItem.defaultProps = {
  data : {
    "ALL": {
      nb_classes: 0,
      nb_annotations: 0
    }
  }
}

export default GenericRibbonItem;
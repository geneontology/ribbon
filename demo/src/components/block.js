import React from 'react';
import PropTypes from 'prop-types';

class Block extends React.Component {
  render() {
    const {slimitem, count, baseRGB} = this.props;
    const plural = (slimitem.count > 1) ? 's' : '';
    const tileTitle       = slimitem.golabel + ":\n" + count + " term" + plural;
    const blockTitleClass = (count > 0) ? 'ribbonBlockTitleTerm bold' : 'ribbonBlockTitleTerm';
    const color           = (count) ? this.heatColor(count, baseRGB, 8) : '';
    return(
      <div className="ribbonBlock" onClick={this.handleOnClick}>
        <div className={blockTitleClass}>{slimitem.golabel}</div>
        <div className="ribbonTile" title={tileTitle} style={{backgroundColor:color}}></div>
      </div>
    );
  }

  heatColor(associations_count, rgb, heatLevels) {
    if( associations_count == 0 ) return "#fff";
    let blockColor = [];     // [r,g,b]
    for( var i=0; i<3; i++ ) {
      // logarithmic heatmap (with cutoff)
      if( associations_count < heatLevels ) {
        // instead of just (256-rgb[i])/(Math.pow(2,associations_count)),
        // which divides space from 'white' (255) down to target color level in halves,
        // this starts at 3/4
        const heatCoef = 3 * (256 - rgb[i]) / (Math.pow(2,associations_count+1));
        blockColor[i] = Math.round( rgb[i] + heatCoef);
      }
      else {
        blockColor[i] = rgb[i];
      }
      // linear heatmap
      // var heatInc = (topHue-rgb[i])/heatLevels;
      // var depression = heatInc*Math.min(heat,heatLevels);
      // c[i] = Math.round(topHue - depression);
    }
    return 'rgb('+blockColor[0]+','+blockColor[1]+','+blockColor[2]+')';
  }

  handleOnClick = (evt) => {
    if (this.props.onTermClick) {
      this.props.onTermClick(data,evt);
    }
  }
}

Block.propTypes = {
  slimitem: PropTypes.shape({
    "goid": PropTypes.string.isRequired,
    "golabel": PropTypes.string.isRequired,
  }).isRequired,
  count: PropTypes.number.isRequired,
  baseRGB: PropTypes.arrayOf((propValue, key, componentName, location, propFullName) => {
    if (propValue.length != 3) {
      return new Error('Invalid prop `' + propFullName + '` supplied to' +
                       ' `' + componentName + '`. An array of 3 integers is required.');
    }
  }).isRequired,
  onTermClick: PropTypes.func,
};

export default Block;

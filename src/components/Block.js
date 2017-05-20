import React from 'react';
import PropTypes from 'prop-types';

class Block extends React.Component {
  render() {
    // usage example:
    const {slimitem, assocs, baseRGB} = this.props;
    var count = 0;
    var assoc_list = [];
    var baseRGB = orthoRGB;
    if (assocs.length > 0) {
      var labels = assocs.map((assocItem, index) => {
        baseRGB = assocItem.subject.id === queryID ? queryRGB : baseRGB;
        console.debug(assocItem.subject.id + ' or ' + queryID);
        return assocItem.subject.taxon.label + ': ' + assocItem.object.label
      });
      var uniqueLabels = labels.filter(function(label, pos) {
        return labels.indexOf(label) === pos;
      });
      count = uniqueLabels.length;
    }
    const tileTitle = (count > 0) ?
      uniqueLabels.join('\n') :
      'No associations to ' + slimitem.golabel;

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
    for ( var i=0; i<3; i++ ) {
      // logarithmic heatmap (with cutoff)
      if ( associations_count < heatLevels ) {
        // instead of just (256-rgb[i])/(Math.pow(2,associations_count)),
        // which divides space from 'white' (255) down to target color level in halves,
        // this starts at 3/4
        const heatCoef = 3 * (256 - rgb[i]) / (Math.pow(2,associations_count+1));
        blockColor[i] = Math.round( rgb[i] + heatCoef);
      }
      else {
        blockColor[i] = rgb[i];
      }
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
  assocs: PropTypes.arrayOf(PropTypes.object).isRequired,
  queryRGB: PropTypes.arrayOf((propValue, key, componentName, location, propFullName) => {
    if (propValue.length != 3) {
      return new Error('Invalid prop `' + propFullName + '` supplied to' +
                       ' `' + componentName + '`. An array of 3 integers is required.');
    }
  }).isRequired,
  orthoRGB: PropTypes.arrayOf((propValue, key, componentName, location, propFullName) => {
    if (propValue.length != 3) {
      return new Error('Invalid prop `' + propFullName + '` supplied to' +
                       ' `' + componentName + '`. An array of 3 integers is required.');
    }
  }).isRequired,
  onTermClick: PropTypes.func,
};

export default Block;

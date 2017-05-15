import React from 'react';
import PropTypes from 'prop-types';

  function Block({slimitem, assocs, baseRGB}) {
    // usage example:
    var count = 0;
    var assoc_list = [];
    if (assocs.length > 0) {
      console.debug('number of assocs: ' + assocs.length);
      var labels = assocs.map((assocItem, index) => {return assocItem.object.label});
      var uniqueLabels = labels.filter(function(label, pos) {
        return labels.indexOf(label) == pos;
      });
      count = uniqueLabels.length;
      console.debug('found ' + count + ' unique associations');
    }
    const plural = (count > 1) ? 's' : '';
    const tileTitle = (count > 0) ?
      uniqueLabels.join('\n') :
      'No associations to ' + slimitem.golabel;
    const blockTitleClass = (count > 0) ? 'ribbonBlockTitleTerm bold' : 'ribbonBlockTitleTerm';
    const color           = (count) ? heatColor(count, baseRGB, 8) : '';
    return(
      <div className="ribbonBlock" onClick={handleOnClick}>
        <div className={blockTitleClass}>{slimitem.golabel}</div>
        <div className="ribbonTile" title={tileTitle} style={{backgroundColor:color}}></div>
      </div>
    );
  }

  function debugArray(item, index) {
      console.debug(item + ' at index ' + index);
  }

  function uniqueAssoc(value, index, self) {
      return assocs.object.label.indexOf(value) === index;
  }

  function heatColor(associations_count, rgb, heatLevels) {
    if ( associations_count == 0 ) return "#fff";
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

  function handleOnClick(evt) {
    if (onTermClick) {
      onTermClick(data,evt);
    }
  }

Block.propTypes = {
  slimitem: PropTypes.shape({
    "goid": PropTypes.string.isRequired,
    "golabel": PropTypes.string.isRequired,
  }).isRequired,
  assocs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    subject: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      taxon: PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string
      })
    }),
    object: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.label
    }),
    relation: PropTypes.any,
    publications: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string
    })),
    provided_by: PropTypes.arrayOf(PropTypes.string),
    slim: PropTypes.arrayOf(PropTypes.string)
  })).isRequired,
  baseRGB: PropTypes.arrayOf((propValue, key, componentName, location, propFullName) => {
    if (propValue.length != 3) {
      return new Error('Invalid prop `' + propFullName + '` supplied to' +
                       ' `' + componentName + '`. An array of 3 integers is required.');
    }
  }).isRequired,
  onTermClick: PropTypes.func,
};

export default Block;

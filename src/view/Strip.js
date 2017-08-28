import React from 'react'
import PropTypes from 'prop-types';

import Block from './Block';
import RibbonStore from '../data/RibbonStore';

export default class Strip extends React.Component {

  render() {
    var slimlist = RibbonStore.getSlimList();
    const StripOfBlocks = slimlist.map((slimitem, index) => {
      return <Block
        goid={slimitem.goid}
        key={slimitem.goid}
      />;
    });
    return(
      <div className='strip'>
        <div>{StripOfBlocks}</div>
      </div>
    );
  }
}

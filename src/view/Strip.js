import React, { PropTypes } from 'react'

import Block from './Block';
import BlockStore from '../data/BlockStore';

export default class Strip extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    const {title} = this.props;
    var slimlist = BlockStore.getSlimList();
    const StripOfBlocks = slimlist.map((slimitem, index) => {
      return <Block
        goid={slimitem.goid}
        key={slimitem.goid}
      />;
    });
    console.log('title: '+title);
    return(
      <div className="ribbonStrip">
        <div className="blockBacker">{StripOfBlocks}</div>
        <div className="stripTitle">{title}</div>
      </div>
    );
  }
}

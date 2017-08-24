import React, { PropTypes } from 'react'
import Block from './Block';

export default class Strip extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    slimlist: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  render() {
    const {title, slimlist} = this.props;
    const StripOfBlocks = slimlist.map((slimitem, index) => {
      return <Block
        slimitem={slimitem}
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

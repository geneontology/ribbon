import React, { PropTypes } from 'react'
import Block from './block';
import SlimList from '../slim.json';

const baseRGB = [0,96,96];

function Strip({title, assoc_count}) {
  console.log('building strip for ' + title);
  const assoc_size = assoc_count != null ? assoc_count.length : -1;
  const StripOfBlocks = SlimList.map((goSlimItem, index) => {
    return <Block
      slimitem={goSlimItem}
      count={assoc_size >= index ? assoc_count[index] : 0}
      baseRGB={baseRGB}
      key={goSlimItem.id + '_' + index}
    />;
  });

  console.log('creating strip div ');

  return(
    <div className="ribbonStrip">
      <div className="blockBacker">{StripOfBlocks}</div>
      <div className="stripTitle">{title}</div>
    </div>
  );
}

Strip.propTypes = {
  title: PropTypes.string,
  assoc_count: PropTypes.arrayOf(PropTypes.number),
};

Strip.defaultProps = {
  title: 'blah-di-blah',
  assoc_count: [],
};

export default Strip;

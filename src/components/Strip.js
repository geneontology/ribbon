import React, { PropTypes } from 'react'
import Block from './Block';

const baseRGB = [0,96,96];

function Strip({title, data}) {
  console.log('building strip for ' + title);
  const StripOfBlocks = data.map((goSlimItem, index) => {
    return <Block
      slimitem={goSlimItem}
      assocs={goSlimItem.assocs}
      baseRGB={baseRGB}
      key={goSlimItem.goid}
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
  data: PropTypes.arrayOf(PropTypes.shape({
    goid: PropTypes.string.isRequired,
    golabel: PropTypes.string.isRequired,
    assocs: PropTypes.arrayOf(PropTypes.object).isRequired
  }))
};

export default Strip;

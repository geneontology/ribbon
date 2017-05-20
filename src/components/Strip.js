import React, { PropTypes } from 'react'
import Block from './Block';

const queryRGB = [0,96,96];
const orthoRGB = [255, 185, 36];

function Strip({title, queryID, data}) {
  console.log('building strip for ' + queryID);
  const StripOfBlocks = data.map((goSlimItem, index) => {
    return <Block
      slimitem={goSlimItem}
      assocs={goSlimItem.assocs}
      queryID={queryID}
      queryRGB={queryRGB}
      orthoRGB={orthoRGB}
      key={goSlimItem.goid}
    />;
  });

  return(
    <div className="ribbonStrip">
      <div className="blockBacker">{StripOfBlocks}</div>
      <div className="stripTitle">{title}</div>
    </div>
  );
}

Strip.propTypes = {
  title: PropTypes.string,
  queryID: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    goid: PropTypes.string.isRequired,
    golabel: PropTypes.string.isRequired,
    assocs: PropTypes.arrayOf(PropTypes.object).isRequired
  }))
};

export default Strip;

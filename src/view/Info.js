import React, { PropTypes } from 'react'

import AssociationsTable from './AssociationsTable';
import BlockStore from '../data/BlockStore';

export default class Info extends React.Component {

  render() {
    const slimlist = BlockStore.getSlimList();
    const InfoArray = slimlist.map((slimitem, index) => {
      return <AssociationsTable
        goid={slimitem.goid}
        key={slimitem.goid}
      />;
    });
    return(
      <div className="ribbonInfo">
        <div className="blockBacker">{InfoArray}</div>
      </div>
    );
  }
}

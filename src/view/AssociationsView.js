import React, { Component }  from 'react';
import PropTypes from 'prop-types';

import AssociationsGeneView from './AssociationsGeneView';

class AssociationsView extends Component {

  static propTypes = {
    currentTermId: PropTypes.string,
    slimlist: PropTypes.arrayOf(
      PropTypes.shape({
        color: PropTypes.string
      })
    )
  };

  render() {
    const {slimlist, currentTermId, geneUrlFormatter} = this.props;
    return (
      <div >
        {
          slimlist.filter((slimitem) => {
            return slimitem.goid === currentTermId;
          }).map((slimitem) => {
            return (
              <AssociationsGeneView
                key={slimitem.goid}
                slimitem={slimitem}
                geneUrlFormatter={geneUrlFormatter}
              />
            )
          })
        }
      </div>
    );
  }
}

export default AssociationsView;

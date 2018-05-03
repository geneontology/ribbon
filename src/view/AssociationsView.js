import React, {Component} from 'react';
import PropTypes from 'prop-types';

import AssociationsGeneView from './AssociationsGeneView';

class AssociationsView extends Component {

    static propTypes = {
        currentTermId: PropTypes.string,
        currentDomain: PropTypes.string,
        hoveredTermId: PropTypes.string,
        hoveredDomain: PropTypes.string,
        slimlist: PropTypes.arrayOf(
            PropTypes.shape({
                goid: PropTypes.string,
                tree: PropTypes.array,
            })
        )
    };

    render() {
        const {slimlist, currentTermId, currentDomain, hoveredDomain, hoveredTermId,geneUrlFormatter} = this.props;
        const filteredSlimlist = slimlist.filter((slimitem) => {
            return (!currentTermId || slimitem.goid === currentTermId)
                && (!currentDomain || slimitem.domain.toLowerCase() === currentDomain.toLowerCase() )
                && (slimitem.tree || []).length > 0;
        });

        return (
            <div>
                <div className='ontology-ribbon-assoc__row'>
                    <div className="ontology-ribbon-assoc__gene2 ontology-ribbon-evidence-header">
                    </div>
                    <div className="ontology-ribbon-assoc__evidence-type ontology-ribbon-evidence-header">
                        Evidence
                    </div>
                    <div className="ontology-ribbon-assoc__evidence-with ontology-ribbon-evidence-header">
                        With
                    </div>
                    <div className="ontology-ribbon-assoc__evidence-reference ontology-ribbon-evidence-header">
                        Reference
                    </div>
                </div>
                {
                    filteredSlimlist.map((slimitem,index) => {
                        return (
                            <AssociationsGeneView
                                key={slimitem.goid}
                                slimitem={slimitem}
                                hoveredDomain = {hoveredDomain}
                                hoveredTermId = {hoveredTermId}
                                geneUrlFormatter={geneUrlFormatter}
                                inputIndex={index}
                            />
                        )
                    })
                }
                {
                    filteredSlimlist.length === 0 ?
                        <span className="ontology-ribbon-assoc__empty">No association found.</span> : null
                }
            </div>
        );
    }
}

export default AssociationsView;

'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import AssociationsWithEvidenceRowView from "./AssociationsWithEvidenceRowView";

class AssociationsGeneView extends Component {

    static propTypes = {
        slimitem: PropTypes.shape({
            tree: PropTypes.array
        })
    };

    constructor() {
        super();
        this.state = {
            selected: undefined
        };
        this.onExpandCollapse = this.onExpandCollapse.bind(this);
    }

    onExpandCollapse(node) {
        const {current_node} = this.state;
        if (current_node) {
            current_node.selected = false;
        }
        node.selected = true;
        if (node.children) {
            node.expanded = !node.expanded;
        }
        this.setState({
            selected: node
        });
    }

    render() {
        const {slimitem, inputIndex, geneUrlFormatter} = this.props;
        const tree = slimitem.tree || [];

        if (tree !== undefined) {
            return (
                <div>
                    {tree.map((taxon_node, index) =>
                        <AssociationsWithEvidenceRowView
                            geneUrlFormatter={geneUrlFormatter}
                            taxon_node={taxon_node}
                            key={index}
                            inputIndex={inputIndex}
                        />
                    )}
                </div>
            );
        }
        else {
            return null;
        }
    }
}

AssociationsGeneView.propTypes = {
    slimitem: PropTypes.shape({
        tree: PropTypes.array,
    }),
    geneUrlFormatter: PropTypes.any,
    inputIndex: PropTypes.number,
};

export default AssociationsGeneView;

'use strict';

import React, { Component }  from 'react';
import PropTypes from 'prop-types';

import AssociationsRowView from './AssociationsRowView';

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
    }
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
    const {slimitem} = this.props;
    const tree = slimitem.tree;

    return (
      <div >
        {tree.map((taxon_node, index) =>
          <AssociationsRowView
            taxon_node={taxon_node}
            key={index}
          />
        )}
      </div>
    );
  }
}
export default AssociationsGeneView;

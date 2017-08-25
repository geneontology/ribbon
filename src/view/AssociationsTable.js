import React from 'react';
import PropTypes from 'prop-types';

import BlockStore from '../data/BlockStore';
import ActionType from '../event/ActionType';

var cols = [
    { key: 'organism', label: 'Organism' },
    { key: 'geneid', label: 'Gene ID' },
    { key: 'assoc', label: 'Annotated as' },
];

class AssociationsTable extends React.Component {

  constructor(props) {
    super(props);
    const {goid} = this.props;
    var slimitem = BlockStore.getSlimItem(goid);
    /*
      For whatever bizarre reasons, in React
      (while anywhere else in the component setState must be used)
      In the constructor it can only be set by direct assignment
      Go figure...
    */
    this.state = ({
      uniqueAssocs: slimitem.uniqueAssocs,
      visible: slimitem.visible
    });
  }

  componentDidMount() {
    BlockStore.addListener(this.onToggle.bind(this), ActionType.TOGGLE );
  }

  onToggle() {
    var visible = BlockStore.isVisible(this.props.goid);
    this.setState({
      visible: visible}
    );
  }

  componentWillUnmount() {
    // BlockStore.removeListener(this.onToggle, ActionType.TOGGLE );
  }

  render() {
    var header = BlockStore.getSlimItem(this.props.goid).golabel;
    var table = null;
    if (this.state.uniqueAssocs.length > 0) {
      var table = (this.state.visible &&
        <div>
          <h3>{header}</h3>
          <table>
            <thead>
              <tr>
                {this.generateHeaders()}
              </tr>
            </thead>
            <tbody>
              {this.generateContent(this.state.uniqueAssocs)}
            </tbody>
          </table>
        </div>
      );
    }
    return table;
  }

  generateHeaders() {
    return cols.map(function(header) {
      return <th key={header.key}>{header.label}</th>;
    });
  }

  generateContent(uniqueAssocs) {
    return uniqueAssocs.map(function(uniqueAssocs, index) {
      return(
        <tr key={index}>
          <td key={cols[0].key}>{uniqueAssocs.subject.taxon.label}</td>
          <td key={cols[1].key}>{uniqueAssocs.subject.id}</td>
          <td key={cols[2].key}>{uniqueAssocs.object.label}</td>
        </tr>
      );
    });
  }
}

AssociationsTable.propTypes = {
  goid: PropTypes.string.isRequired
};

export default AssociationsTable;

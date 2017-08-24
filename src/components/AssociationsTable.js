import React from 'react';
import PropTypes from 'prop-types';

var cols = [
    { key: 'organism', label: 'Organism' },
    { key: 'geneid', label: 'Gene ID' },
    { key: 'assoc', label: 'Annotated as' },
];

class AssociationsTable extends React.Component {
  render() {
    const {uniqueAssocs, visible} = this.props;
    var table = null;
    if (uniqueAssocs.length > 0) {
      var table = (visible &&
        <div>
          <table>
            <thead>
              <tr>
                {this.generateHeaders()}
              </tr>
            </thead>
            <tbody>
              {this.generateContent(uniqueAssocs)}
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
  uniqueAssocs: PropTypes.arrayOf(PropTypes.object).isRequired,
  visible: PropTypes.bool.isRequired,
};

export default AssociationsTable;

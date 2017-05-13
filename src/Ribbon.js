
import React, { Component, PropTypes } from 'react'
//import {render} from 'react-dom';
//import PropTypes from 'prop-types';

import axios from 'axios';

import './index.css';

import Strip from './components/Strip';

import SlimList from './slim.json';

var BIOLINK =
'https://api.monarchinitiative.org/api/bioentityset/slimmer/function?slim=GO:0003824&slim=GO:0004872&slim=GO:0005102&slim=GO:0005215&slim=GO:0005198&slim=GO:0008092&slim=GO:0003677&slim=GO:0003723&slim=GO:0001071&slim=GO:0036094&slim=GO:0046872&slim=GO:0030246&slim=GO:0008283&slim=GO:0071840&slim=GO:0051179&slim=GO:0032502&slim=GO:0000003&slim=GO:0002376&slim=GO:0050877&slim=GO:0050896&slim=GO:0023052&slim=GO:0010467&slim=GO:0019538&slim=GO:0006259&slim=GO:0044281&slim=GO:0050789&slim=GO:0005576&slim=GO:0005829&slim=GO:0005856&slim=GO:0005739&slim=GO:0005634&slim=GO:0005694&slim=GO:0016020&slim=GO:0071944&slim=GO:0030054&slim=GO:0042995&slim=GO:0032991&subject=';

function hasAssociations(goSlimItem) {
  return function(element) {
    return (element.slim === goSlimItem.goid);
  }
}

export default class Ribbon extends React.Component {

  static propTypes = {
    db: PropTypes.string,
    id: PropTypes.string,
    // change handlers are automatically generated and passed if a config is provided
    // and `addChangeHandlers` isn't false. They use `replaceIn` by default, just
    // updating that single query parameter and keeping the other existing ones.
    onChangeDb: PropTypes.func,
    onChangeId: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      title: 'nada',
      assoc_count:  SlimList.map((goSlimItem, index) => {return 0;})
    };
  }

  componentDidMount() {
    var _this = this;
    const {db, id, onChangeDb, onChangeId} = this.props;
    console.debug ('db is ' + db + ' and id is ' + id);
    var biolinkURL = BIOLINK + db + ':' + id;
    console.debug(biolinkURL);
    this.serverRequest = axios
      .get(biolinkURL)
      .then(function(result) {
        console.debug("got results!");
        _this.setState({
          // we got it!
          title:        result.data[0].assocs[0].subject.label + ' (' +
                        result.data[0].assocs[0].subject.taxon.label + ')',
          assoc_count:  SlimList.map((goSlimItem, index) => {
            var assocs_index = result.data.findIndex(hasAssociations(goSlimItem));
            return assocs_index >= 0 ? result.data[assocs_index].assocs.length : 0;
          }),
        })
      })
      .catch(function(error) {
        console.debug(error);
        _this.setState({
          title:        'Unable to retrieve ' + db + ':' + id,
          assoc_count:  SlimList.map((goSlimItem, index) => {return 0;})
        });
      });
  }

  render() {
    const {db, id, onChangeDb, onChangeId} = this.props;
    console.debug('rendering ' + this.state.title);
    return (
      <div className="GoView">
        <div className="blockBacker">
          <Strip title={this.state.title} assoc_count={this.state.assoc_count}  />;
        </div>
      </div>
    );
  }
}


// render(<Demo/>, document.querySelector('#demo'))


import React, { Component, PropTypes } from 'react'
//import {render} from 'react-dom';
//import PropTypes from 'prop-types';

import axios from 'axios';

import SlimList from './slim.json';

var BIOLINK =
'https://api.monarchinitiative.org/api/bioentityset/slimmer/function?slim=GO:0003824&slim=GO:0004872&slim=GO:0005102&slim=GO:0005215&slim=GO:0005198&slim=GO:0008092&slim=GO:0003677&slim=GO:0003723&slim=GO:0001071&slim=GO:0036094&slim=GO:0046872&slim=GO:0030246&slim=GO:0008283&slim=GO:0071840&slim=GO:0051179&slim=GO:0032502&slim=GO:0000003&slim=GO:0002376&slim=GO:0050877&slim=GO:0050896&slim=GO:0023052&slim=GO:0010467&slim=GO:0019538&slim=GO:0006259&slim=GO:0044281&slim=GO:0050789&slim=GO:0005576&slim=GO:0005829&slim=GO:0005856&slim=GO:0005739&slim=GO:0005634&slim=GO:0005694&slim=GO:0016020&slim=GO:0071944&slim=GO:0030054&slim=GO:0042995&slim=GO:0032991&subject=';

function hasAssociations(goSlimItem) {
  return function(element) {
    return (element.slim === goSlimItem.goid);
  }
}

export default class RibbonDataProvider extends React.Component {

  static propTypes = {
    db: PropTypes.string,
    id: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      title: null,
      assocCount:  SlimList.map((goSlimItem, index) => {return 0;}),
      dataReceived: false,
      dataError : null
    };
  }

  fetchData() {
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
          dataReceived: true,
          title:        result.data[0].assocs[0].subject.label + ' (' +
                        result.data[0].assocs[0].subject.taxon.label + ')',
          assocCount:  SlimList.map((goSlimItem, index) => {
            var assocs_index = result.data.findIndex(hasAssociations(goSlimItem));
            return assocs_index >= 0 ? result.data[assocs_index].assocs.length : 0;
          }),
        })
      })
      .catch(function(error) {
        console.debug(error);
        _this.setState({
          dataError: 'Unable to retrieve ' + db + ':' + id,
          title:        'Unable to retrieve ' + db + ':' + id,
          assocCount:  SlimList.map((goSlimItem, index) => {return 0;})
        });
      });
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.db !== prevProps.db || this.props.id !== prevProps.id) {
      this.fetchData();
    }
  }

  render() {
    const {title, assocCount, dataReceived, dataError } = this.state;
    return this.props.children({
      title,
      assocCount,
      dataReceived,
      dataError
    });
  }
};


// render(<Demo/>, document.querySelector('#demo'))

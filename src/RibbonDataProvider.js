import React, { Component, PropTypes } from 'react'
//import {render} from 'react-dom';
//import PropTypes from 'prop-types';

import axios from 'axios';

import SLIM_LIST from './slim';

var GOLINK =
'https://api.monarchinitiative.org/api/bioentityset/slimmer/function?slim=GO:0003824&slim=GO:0004872&slim=GO:0005102&slim=GO:0005215&slim=GO:0005198&slim=GO:0008092&slim=GO:0003677&slim=GO:0003723&slim=GO:0001071&slim=GO:0036094&slim=GO:0046872&slim=GO:0030246&slim=GO:0008283&slim=GO:0071840&slim=GO:0051179&slim=GO:0032502&slim=GO:0000003&slim=GO:0002376&slim=GO:0050877&slim=GO:0050896&slim=GO:0023052&slim=GO:0010467&slim=GO:0019538&slim=GO:0006259&slim=GO:0044281&slim=GO:0050789&slim=GO:0005576&slim=GO:0005829&slim=GO:0005856&slim=GO:0005739&slim=GO:0005634&slim=GO:0005694&slim=GO:0016020&slim=GO:0071944&slim=GO:0030054&slim=GO:0042995&slim=GO:0032991&subject=';

export default class RibbonDataProvider extends React.Component {

  static propTypes = {
    db: PropTypes.string,
    id: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      title: null,
      queryID: null,
      responseData: [],
      dataReceived: false,
      dataError : null
    };
  }

  fetchData() {
    var _this = this;
    const {db, id} = this.props;
    var queryResponse = [];
    var queryID = db + ':' + id;
    var label = queryID;
    var orthoURL =  'https://api.monarchinitiative.org/api/bioentity/gene/' +
                    queryID + '/homologs/?homology_type=O&fetch_objects=false';
    // First get any orthologs for this gene
    axios.get(orthoURL)
    .then((results) => {
      var goQueries = results.data.objects.map(function(orthologID) {
        return GOLINK + orthologID;
      });
      goQueries.push(GOLINK + queryID);
      let promiseArray = goQueries.map(url => axios.get(url));
      return axios.all(promiseArray);
    })
    // Then run all the GO queries in a batch,
    // both the gene of interest and all the orthologs that were found
    .then((function(results) {
      results.forEach(function(result) {
        if (result.data.length > 0) {
          if (result.data[0].subject === queryID) {
            label = result.data[0].assocs[0].subject.label + ' (' +
                     result.data[0].assocs[0].subject.taxon.label + ')';
            console.debug('query match ' + queryID);
          } else {
            console.debug('ortholog match ' + result.data[0].subject);
          }
          Array.prototype.push.apply(queryResponse, result.data);
          console.log(queryResponse.length + ' total responses ');
        }
      });
      _this.setState({
        // we got it!
        dataReceived: true,
        queryID: queryID,
        title: label,
        responseData: queryResponse
      })
    }))
    .catch(function(error) {
      if(error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log(error.message);
      }
      _this.setState({
        dataReceived: true,
        queryID: queryID,
        title: label + ' ' + error,
        responseData: queryResponse,
        dataError: 'Unable to get data for ' + queryID
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
    const {queryID, title, responseData, dataReceived, dataError } = this.state;
    // initialize array of associations
    const data = SLIM_LIST.map((slimStub) => {
      /* now need to gather all of the matching associations
        from each of the organisms
        because there may be a matching slim from more than
        one organism
      */
      var assocs = [];
      responseData.forEach(function(response) {
        if (response.slim === slimStub.goid) {
          Array.prototype.push.apply(assocs, response.assocs);
        }
      });

      const defaultSlim = Object.assign({
        assocs: assocs
      }, slimStub);
      return defaultSlim;
    });
    return this.props.children({
      title,
      queryID,
      data,
      dataReceived,
      dataError
    });
  }
};

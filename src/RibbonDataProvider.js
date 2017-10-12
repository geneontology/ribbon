import React, { Component } from 'react'
import PropTypes from 'prop-types';

import axios from 'axios';

import { unpackSlimItems } from './dataHelpers';

import AGR_LIST from './data/agr';
import TCAG_LIST from './data/tcag';
import FLY_LIST from './data/fly';
import JAX_LIST from './data/jax';
import POMBE_LIST from './data/pombe';
import AGR_taxa from './data/taxa';

//const GOLINK = 'https://api.monarchinitiative.org/api/';
const GOLINK = 'http://localhost:8888/api/';

export default class Ribbon extends React.Component {
  static propTypes = {
    subject: PropTypes.string.isRequired,
    slim: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
    }
    this.fetchData = this.fetchData.bind(this);
    this.setState = this.setState.bind(this);
  }

  componentDidMount() {
    const {subject, slim} = this.props;
    var useslim = (typeof slim === "undefined" || slim === null)
                  ? 'agr' : slim;
    this.setState({
      fetching: true,
    });
    this.fetchData(useslim, subject);
  }

  fetchData(slim, subject) {
    var slimlist =  slim.toLowerCase() === 'tcag' ? TCAG_LIST :
                    slim.toLowerCase() === 'fly' ? FLY_LIST :
                    slim.toLowerCase() === 'jax' ? JAX_LIST :
                    slim.toLowerCase() === 'pombe' ? POMBE_LIST :
                    AGR_LIST;
    var goLink = GOLINK + 'bioentityset/slimmer/function?';
    slimlist.forEach(function(slimitem) {
      if (slimitem.separator === undefined) {
        goLink = goLink + '&slim=' + slimitem.goid;
      }
    });
    var subjectID = subject.replace('WB', 'WormBase');
    console.log('subjectID='+subjectID);
    var orthoURL =  GOLINK + 'bioentity/gene/' +
                    subjectID +
                    '/homologs/?homology_type=O&fetch_objects=false';
    console.log(orthoURL);

    var title = subject;
    var dataError = null;
    var self = this;
    axios.get(orthoURL)
    .then(function(results) {
      var queryTaxon = results.data.associations.length > 0 ?
        results.data.associations[0].subject.taxon.id :
        '';
      var goQueries = [];
      results.data.associations.forEach(function(ortholog_assoc) {
        // ignore paralogs, not expecting any but just in case
        if (ortholog_assoc.object.taxon.id !== queryTaxon) {
          var value = AGR_taxa.get(ortholog_assoc.object.taxon.id);
          if (value !== 'undefined') {
            goQueries.push(goLink + '&subject=' + ortholog_assoc.object.id);
          }
        }
      });
      goQueries.push(goLink + '&subject=' + subject);
      console.log('slim query: '+ goQueries[goQueries.length-1]);

      // Then run all the GO queries in a batch,
      // both the gene of interest and all the orthologs that were found        let orthologArray = goQueries.map(url => axios.get(url));
      let orthologArray = goQueries.map(url => axios.get(url));
      return axios.all(orthologArray);
    })
    .then(function(results) {
      const {title, data} = unpackSlimItems(results, subject, slimlist);
      self.setState({
        fetching: false,
        title: title,
        dataError: null,
        data: data
      });
    })
    .catch(function(error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        dataError = ('Unable to get data for ' +
                    subject +
                    ' because ' +
                    error.status);
      } else if (error.request) {
        console.log(error.request);
        dataError = ('Unable to get data for ' +
                    subject +
                    ' because ' +
                    error.request);
      } else {
        console.log(error.message);
        dataError = ('Unable to get data for ' +
                    subject +
                    ' because ' +
                    error.message);
      }
      self.setState({
        fetching: false,
        title: title,
        dataError: dataError
      });
    });
  }

  handleSlimSelect = (termId) => {
    this.setState({
      currentTermId: termId
    });
  }

  render() {
    const {title, data, dataError, fetching} =  this.state;
    return this.props.children({
      title,
      data,
      dataError,
      dataReceived: !fetching && !dataError,
    });
  }
}

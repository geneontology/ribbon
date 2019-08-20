'use strict';

import { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { getConfig } from './config';
import { unpackSlimItems, createSlims } from './dataHelpers';

export default class RibbonDataProvider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
    };
  }

  componentDidMount() {
    const { subject, mode } = this.props;
    let self = this;

    let config = getConfig(mode);
    self.fetchData(config, subject)
    .then(results => {
      self.aggregateData(config, results)    
    })
    .catch(error => {
      this.setState({
        fetching: false,
        dataError: error
      });
    })
  }

  /**
   * Create a Map<bioentity, [results]> based on a list of [results]
   * @param {BioLink Slimmer Result} results 
   */
  divide(results) {
    var map = new Map();
    results.forEach(elt => {
      let list = [];
      if (map.has(elt.subject)) {
        list = map.get(elt.subject);
      } else {
        map.set(elt.subject, list);
      }
      list.push(elt);
    })
    return map;
  }

  fetchData(config, subjects) {
    this.setState({
      fetching: true,
    });

    // Build up the query string by adding all the GO ids
    let slimlist = config.slimlist;
    let bio_link = config.bio_link;
    slimlist.forEach(function (slimitem) {
      if (slimitem.separator === undefined && slimitem.class_id.length > 0) {
        bio_link = bio_link + '&slim=' + slimitem.class_id;
      }
    });

    // required to launch the correct BioLink query with several subjects
    let joinSubjects = subjects;
    if (Array.isArray(subjects)) {
      joinSubjects = subjects.join("&subject=");
    }

    // Todo: this will have to be fixed on the biolink-api /slimmer side, but meanwhile, we ensure that ALL annotations are loaded
    let query = bio_link + '&subject=' + joinSubjects + "&rows=-1";
    // console.log('Query is ' + query);
    return axios.get(query);
  }

  aggregateData(config, results) {
    let map = this.divide(results.data);
    let entities = [];

    // no results retrieved
    if(map.size == 0) {
      this.setState({
        entities: entities,
        config: config,
        dataError: null,
        fetching: false,
      });
  }

    // for each entity retrieved
    map.forEach((value, subject) => {

      // retrieve association and map terms
      unpackSlimItems([{ data: value }], subject, config)
      .then(result => {
        const { associations, termAspect } = result;
        let { filters, label, blocks, taxon } = createSlims(subject, config, associations, termAspect);
        entities.push({ subject: subject, taxon: taxon, blocks: blocks, filters: filters, label: label });
      })
      .catch(error => {
        this.setState({
          dataError: error,
          fetching: false,
        });
        console.error("Error while unpacking slim items: ", error);
      })
      .finally(() => {
        this.setState({
          entities: entities,
          config: config,
          dataError: null,
          fetching: false,
        });
      });

    })

  }

  render() {
    const { entities, config, dataError, fetching } = this.state;
    let self = this;
    console.log("entities: ", entities);
    return self.props.children({
      entities,
      config,
      dataError,
      dataReceived: !fetching && !dataError
    });
  }
}

RibbonDataProvider.propTypes = {
  mode: PropTypes.string,
  subject: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]).isRequired
};

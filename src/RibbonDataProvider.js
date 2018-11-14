'use strict';

import {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {getConfig} from './config';
import {unpackSlimItems} from './dataHelpers';

export default class RibbonDataProvider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
    };
  }

  componentDidMount() {
    const {subject, mode} = this.props;
    let self = this;

    self.setState({
      fetching: true,
    });
    let config = getConfig(mode);
    self.fetchData(config, subject);
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
    console.log("fetching data for subjects: ", subjects);
    let title = "N/A";
    // let title = subjects;
    let dataError = null;
    let self = this;

    /*
      Build up the query string by adding all the GO ids
    */
    let slimlist = config.slimlist;
    let bio_link = config.bio_link;
    slimlist.forEach(function (slimitem) {
      if (slimitem.separator === undefined && slimitem.class_id.length > 0) {
        bio_link = bio_link + '&slim=' + slimitem.class_id;
      }
    });

    // required to launch the correct BioLink query with several subjects
    let joinSubjects = subjects;
    if(Array.isArray(subjects)) {
      joinSubjects = subjects.join("&subject=");
    }
    
    /*
      Todo: this will have to be fixed on the biolink-api /slimmer side, but meanwhile, we ensure that ALL annotations are loaded
    */
    let query = bio_link + '&subject=' + joinSubjects + "&rows=-1";
    console.log('Query is ' + query);
    axios.get(query)
      .then(function (results) {
        let map = self.divide(results.data);
        // console.log("map: ", map);
        let entities = [];
        map.forEach((value, key) => {
          let {eco_list, title, blocks, taxon} = unpackSlimItems([{data: value}], key, config);
          // console.log("RDP::blocks(" + title + "): " , blocks);
          entities.push({ subject: key, taxon: taxon, blocks: blocks, eco_list: eco_list, title: title });
        })
        // console.log("entities: ", entities);

        self.setState({
          entities: entities,
          // blocks: blocks,
          config: config,
          dataError: null,
          // eco_list: eco_list,
          fetching: false,
          // title: title,
        });

        console.log("state: ", self.state);
      })
      .catch(function (error) {
        if (error.response) {
          dataError = ('Unable to get data for ' +
                subjects +
                ' because ' +
                error.status);
        } else if (error.request) {
          dataError = ('Unable to get data for ' +
                subjects +
                ' because ' +
                error.request);
        } else {
          dataError = ('Unable to get data for ' +
              subjects +
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

  render() {
    const {entities, config, dataError, fetching} = this.state;
    let self = this;
    // console.log("ribbondataprovider::render: ", entities);
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

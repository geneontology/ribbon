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

  fetchData(config, subject) {
    let title = subject;
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

    /*
      Todo: this will have to be fixed on the biolink-api /slimmer side, but meanwhile, we ensure that ALL annotations are loaded
    */
    let query = bio_link + '&subject=' + subject + "&rows=-1";
    console.log('Query is ' + query);
    axios.get(query)
      .then(function (results) {
        const {eco_list, title, blocks} = unpackSlimItems([results], subject, config);
        self.setState({
          blocks: blocks,
          config: config,
          dataError: null,
          eco_list: eco_list,
          fetching: false,
          title: title,
        });
      })
      .catch(function (error) {
        if (error.response) {
          dataError = ('Unable to get data for ' +
                subject +
                ' because ' +
                error.status);
        } else if (error.request) {
          dataError = ('Unable to get data for ' +
                subject +
                ' because ' +
                error.request);
        } else {
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

  render() {
    const {blocks, config, dataError, eco_list, fetching, title} = this.state;
    let self = this;
    return self.props.children({
      blocks,
      config,
      dataError,
      dataReceived: !fetching && !dataError,
      eco_list,
      title,
    });
  }
}

RibbonDataProvider.propTypes = {
  mode: PropTypes.string,
  subject: PropTypes.string.isRequired,
};

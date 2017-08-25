import React, { Component, PropTypes } from 'react'
import axios from 'axios';
import { GridLoader } from 'react-spinners';

import Strip from './view/Strip';
import Info from './view/Info';
import BlockStore from './data/BlockStore';

import AGR_LIST from './data/agr';
import TCAG_LIST from './data/tcag';

// http://127.0.0.1:8888
const AGRLINK = 'https://api.monarchinitiative.org/api/bioentityset/slimmer/function?slim=GO:0003824&slim=GO:0004872&slim=GO:0005102&slim=GO:0005215&slim=GO:0005198&slim=GO:0008092&slim=GO:0003677&slim=GO:0003723&slim=GO:0001071&slim=GO:0036094&slim=GO:0046872&slim=GO:0030246&slim=GO:0008283&slim=GO:0071840&slim=GO:0051179&slim=GO:0032502&slim=GO:0000003&slim=GO:0002376&slim=GO:0050877&slim=GO:0050896&slim=GO:0023052&slim=GO:0010467&slim=GO:0019538&slim=GO:0006259&slim=GO:0044281&slim=GO:0050789&slim=GO:0005576&slim=GO:0005829&slim=GO:0005856&slim=GO:0005739&slim=GO:0005634&slim=GO:0005694&slim=GO:0016020&slim=GO:0071944&slim=GO:0030054&slim=GO:0042995&slim=GO:0032991&subject=';

const TCAGLINK = 'https://api.monarchinitiative.org/api/bioentityset/slimmer/function?&slim=GO:0007219&slim=GO:0035329&slim=GO:0006281&slim=GO:0000077&slim=GO:0048017&slim=GO:0016055&slim=GO:0006915&slim=GO:0022402&slim=GO:0016570&slim=GO:0034599&slim=GO:0007265&slim=GO:0007179&slim=GO:0030330&subject=';

const AGR_taxons = [
    'NCBITaxon:7227', // fly
    'NCBITaxon:7955', // zebrafish
    'NCBITaxon:4932', // yeast
    'NCBITaxon:6239', // worm
    'NCBITaxon:10116', //rat
    'NCBITaxon:10090', // mouse
    'NCBITaxon:9606' // human
];

export default class Ribbon extends React.Component {
  static propTypes = {
    subject: PropTypes.string.isRequired,
    mode: PropTypes.string,
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
    const {subject, mode} = this.props;
    var usemode = (typeof mode === "undefined" || mode === null)
                  ? 'agr' : mode;
    console.log('In Ribbon fetching '+subject);
    this.fetchData(usemode, subject);
  }

  fetchData(mode, subject) {
    var title = subject;
    var dataError = null;
    var slimlist = mode === 'agr' ? AGR_LIST : TCAG_LIST;
    var goLink = mode === 'agr' ? AGRLINK : TCAGLINK;
    var orthoURL =  'https://api.monarchinitiative.org/api/bioentity/gene/' +
                    subject +
                    '/homologs/?homology_type=O&fetch_objects=false';
    this.setState({
      fetching: true,
      title: title,
      slimlist: slimlist,
      dataError: dataError
    });
    var self = this;
    axios.get(orthoURL)
    .then(function(results) {
      console.log('fetched orthologs');
      var queryTaxon = results.data.associations.length > 0 ?
        results.data.associations[0].subject.taxon.id :
        '';
      var goQueries = [];
      results.data.associations.forEach(function(ortholog_assoc) {
        // ignore paralogs, not expecting any but just in case
        if (ortholog_assoc.object.taxon.id !== queryTaxon) {
          var index = AGR_taxons.indexOf(ortholog_assoc.object.taxon.id);
          if (index >= 0) {
            goQueries.push(goLink + ortholog_assoc.object.id);
          }
        }
      });
      goQueries.push(goLink + subject);
      console.log(goLink+subject);
      // Then run all the GO queries in a batch,
      // both the gene of interest and all the orthologs that were found        let orthologArray = goQueries.map(url => axios.get(url));
      let orthologArray = goQueries.map(url => axios.get(url));
      return axios.all(orthologArray);
    })
    .then(function(results) {
      var queryResponse = [];
      results.forEach(function(result) {
        if (result.data.length > 0) {
          /*
            Short term interim hack because of differences in resource naming
            e.g. FlyBase === FB
          */
          var subjectID = result.data[0].subject.replace('FlyBase', 'FB');
          if (subjectID === subject) {
            title = result.data[0].assocs[0].subject.label + ' (' +
                    result.data[0].assocs[0].subject.taxon.label + ')';
          }
          Array.prototype.push.apply(queryResponse, result.data);
        }
      });
      console.log('got assocs for '+queryResponse.length+' go terms');
      BlockStore.initSlimItems(queryResponse, subject, slimlist);
      self.setState({
        fetching: false,
        title: title
      });
    })
    .catch(function(error) {
      if(error.response) {
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
        dataError: dataError
      });
    });
  }

  render() {
    if (this.state.fetching) {
      return (
        <div >
          <GridLoader className='spinner'
            color='#acd'
            size='8px'
            margin='2px'
            loading={this.state.fetching}
          />
        </div>
      );
    }
    if (this.state.dataError === null) {
      return(
        <div>
          <div className="blockBacker">
            <Strip title={this.state.title} />
            <Info />
          </div>
        </div>
      );
    }
    else {
      return (
        <div>
          <title>{this.state.dataError}</title>
        </div>
      );
    }
  }
}

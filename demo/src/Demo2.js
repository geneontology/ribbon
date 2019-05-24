import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import { GridLoader } from 'react-spinners';

import GenericRibbon from '../../src/components/GenericRibbon';
import AssociationsView from '../../src/view/AssociationsView';

import { POSITION, COLOR_BY } from '../../src/enums';
import '../../src/main.scss'


// const goApiUrl = 'https://api.geneontology.org/api/ontology/ribbon/';
const goApiUrl = 'http://127.0.0.1:5000/api/';

/**
 * Specify how the URL gets decoded here. This is an object that takes the prop
 * name as a key, and a query param specifier as the value. The query param
 * specifier can have a `type`, indicating how to decode the value from the
 * URL, and a `queryParam` field that indicates which key in the query
 * parameters should be read (this defaults to the prop name if not provided).
 *
 */

const urlPropsQueryConfig = {
  subject: { type: UrlQueryParamTypes.string },
  mode: { type: UrlQueryParamTypes.string },
};

/**
 * Map from url query params to props. The values in `url` will still be encoded
 * as strings since we did not pass a `urlPropsQueryConfig` to addUrlProps.
 */
function mapUrlToProps(url) {
  console.log("url: ", url)
  return {
    subject: url.subject,
    mode: url.mode,
    entityLabel : url.entityLabel ? +url.entitylabel : POSITION.RIGHT,  // expect a number, see enums.POSITION
    colorBy : url.colorBy ? +url.colorBy : COLOR_BY.CLASS_COUNT,        // expect a number, see enums.COLOR_BY
    binaryColor : (url.binaryColor == 'true')
  };
}

class Demo2 extends React.Component {

  subjectBaseURL : "http://amigo.geneontology.org/amigo/gene_product/";

  constructor(props) {
    super(props);
    this.state = {
      loading : true,
      selected : {
        subject : null,
        group : null,
        data : null,
        ready : false    
      }
    }
  }

  componentDidMount() {
    if (this.state.loading) {
      this.fetchData("goslim_agr", this.props.subject)
      .then(data => {
        this.setState({ loading : false, ribbon : data.data })
      })
    }
  }

  fetchData = (subset, subjects) => {
    if(subjects instanceof Array) {
      subjects = subjects.join("&subject=");
    }
    // let query = goApiUrl + "ontology/ribbon/?subset=" + subset + '&subject=' + subjects;
    let query = "https://build.alliancegenome.org/api/gene/" + subjects + "/disease-ribbon-summary";
    console.log('Query is ' + query);
    return axios.get(query);
  }

  fetchAssociationData = (subject, group) => {
    let query = goApiUrl + "bioentityset/slimmer/function?slim=" + group + '&subject=' + subject + '&rows=-1';
    console.log('Query is ' + query);
    return axios.get(query);
  }

  /** 
   * building the filters from the keys contained in the subject.groups field of the data response
  */
  buildFilters() {
    var filters = new Map();
    for(var subject of this.state.ribbon.subjects) {
      for (var group in subject.groups) {
        for(var eco in subject.groups[group]) {
          if(eco.toLowerCase() != "all") {
            filters.set(eco, true);
          }
        }
      }
    }
    return filters;
  }

  /** 
   * build from the association response of BioLink
  */
  buildEvidenceMap() {
    console.log("build: ", this.state.selected.data);
    for(var assoc of this.state.selected.data) {
      assoc.evidence_map = new Map();
        assoc.evidence_map.set(assoc.evidence, [
          {
            evidence_id : assoc.evidence,
            evidence_label : assoc.evidence_label,
            evidence_qualifier : [],
            evidence_refs : assoc.reference,
            evidence_type : assoc.evidence_type,
            evidence_with : assoc.evidence_with ? assoc.evidence_with : []
          }
        ]
        )
    }
    this.setState({ 
      selected : {
        subject : this.state.selected.subject,
        group : this.state.selected.group,
        data : this.state.selected.data,
        ready : true
      }
    })
//    this.state.selected.ready = true;
  }

  defaultConfig() {
    return {
      termUrlFormatter : this.subjectBaseURL
    }
  }

  render() {
    console.log("RENDER: ", this.state);
    return (
      <div style={{ width : '1400px' }}>
            { this.state.loading 
                  ? "Loading..." 
                  : <GenericRibbon  categories={this.state.ribbon.categories} 
                                    subjects={this.state.ribbon.subjects} 

                                    subjectLabelPosition={POSITION.RIGHT}
                                    colorBy={COLOR_BY.CLASS_COUNT}
                                    
                                    itemEnter={this.itemEnter}
                                    itemLeave={this.itemLeave}
                                    itemOver={this.itemOver}
                                    itemClick={this.itemClick.bind(this)}
                                    />
            }
            {
              (this.state.selected.data && this.state.selected.ready)
                  ? <AssociationsView blocks={null}
                                      config={this.defaultConfig()}
                                      currentblock={null}
                                      filters={this.buildFilters()}
                                      focalblock={null}
                                      tableLabel={null}
                                      provided_list={this.state.selected.data}
                                      />
                  : ""
           }
      </div>
    )
  }

  itemEnter(subject, group) {
    // console.log("ITEM ENTER: ", subject , group);
  }

  itemLeave(subject, group) {
    // console.log("ITEM LEAVE: ", subject , group);
  }

  itemOver(subject, group) {
    // console.log("ITEM OVER: ", subject , group);
  }

  itemClick(subject, group) {
    console.log("ITEM CLICK: ", subject , group);
    // this.setState({ selected : {
    //   subject : subject,
    //   group : group,
    //   data : null,
    //   ready : false
    // }})

    // this.fetchAssociationData(subject.id, group.id)
    // .then(data => {
    //   console.log("retrieved data: " , data);
    //   this.setState({ selected : {
    //     subject : subject,
    //     group : group,
    //     data : data.data[0].assocs,
    //     ready : false
    //   }})
    //   this.buildEvidenceMap();
    // })
  }

}

Demo2.propTypes = {
  mode: PropTypes.string,
  subject: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ])
};

/*
 * We use the addUrlProps higher-order component to map URL query parameters
 * to props for Demo. In this case the mapping happens automatically by
 * first decoding the URL query parameters based on the urlPropsQueryConfig.
 */
export default addUrlProps({ mapUrlToProps })(Demo2);

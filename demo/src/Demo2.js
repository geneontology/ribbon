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

  constructor(props) {
    super(props);
    this.state = {
      loading : true,
      selected : {
        subject : null,
        group : null,
        data : null        
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
    let query = goApiUrl + "ontology/ribbon/?subset=" + subset + '&subject=' + subjects;
    console.log('Query is ' + query);
    return axios.get(query);
  }

  fetchAssociationData = (subject, group) => {
    let query = goApiUrl + "bioentityset/slimmer/function?slim=" + group + '&subject=' + subject + '&rows=-1';
    console.log('Query is ' + query);
    return axios.get(query);
  }

  render() {
    console.log("RENDER: ", this.state);

    return (
      <div style={{ width : '1300px' }}>
            { this.state.loading 
                  ? "Loading..." 
                  : <GenericRibbon  categories={this.state.ribbon.categories} 
                                    subjects={this.state.ribbon.subjects} 
                                    
                                    itemEnter={this.itemEnter}
                                    itemLeave={this.itemLeave}
                                    itemOver={this.itemOver}
                                    itemClick={this.itemClick.bind(this)}
                                    />
            }
            {
              !this.state.selected.data
                  ? ""
                  : <AssociationsView blocks={null}
                                      config={null}
                                      currentblock={null}
                                      filters={null}
                                      focalblock={null}
                                      tableLabel={null}
                                      />
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
    this.setState({ selected : {
      subject : subject,
      group : group,
      data : null
    }})

    this.fetchAssociationData(subject.id, group.id)
    .then(data => {
      console.log("retrieved data: " , data);
      this.setState({ selected : {
        subject : subject,
        group : group,
        data : data
      }})
    })
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

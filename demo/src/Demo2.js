import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import { GridLoader } from 'react-spinners';

import GenericRibbon from '../../src/components/GenericRibbon';
import AssociationsView from '../../src/view/AssociationsView';

import { POSITION, COLOR_BY, SELECTION } from '../../src/enums';
import '../../src/main.scss'


// const goApiUrl = 'https://api.geneontology.org/api/ontology/ribbon/';
const goApiUrl = 'https://api.geneontology.org/api/';
// const goApiUrl = 'http://127.0.0.1:5000/api/';

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
      subjectBaseURL : props.subjectBaseURL,
      selectionMode : props.selectionMode,
      crossAspect : false,
      excludePB : true,
      excludeIBA : true,
      onlyEXP : false,
      selected : {
        subject : null,
        group : null,
        data : null,
        ready : false,
      },
      search : ""
    }
  }

  componentDidMount() {
    if (this.state.loading) {
      this.fetchData("goslim_agr", this.props.subject)
      .then(data => {
//        console.log("fetch data: ", data);
        this.setState({ loading : false, ribbon : data.data })
      })
    }
  }


  fetchData = (subset, subjects) => {
    if(subjects instanceof Array) {
      subjects = subjects.join("&subject=");
    }
    let query = goApiUrl + "ontology/ribbon/?subset=" + subset + '&subject=' + subjects;
    // let query = "https://build.alliancegenome.org/api/gene/" + subjects + "/disease-ribbon-summary";
    console.log('Query is ' + query);
    return axios.get(query);
  }

  fetchAssociationData = (subjects, group) => {
    if(group == "all") {
      var groups = this.state.ribbon.categories.map(elt => {
        return elt.id;
      })
      group = groups.join("&slim=");
    }
    let subs = "&subject=" + subjects.join("&subject=");
    let query = goApiUrl + "bioentityset/slimmer/function?slim=" + group + subs + '&rows=-1';
    // console.log('Fetch query is ' + query);
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

  sameEntity(entity1, entity2) {
    return  entity1.id == entity2.id && 
            entity1.iri == entity2.iri &&
            JSON.stringify(entity1.category) == JSON.stringify(entity2.category)
  }

  sameEvidences(assoc1, assoc2) {
    if(assoc1.evidence != assoc2.evidence || assoc1.evidence_type != assoc2.evidence_type)
      return false;
    if(JSON.stringify(assoc1.evidence_closure) != JSON.stringify(assoc2.evidence_closure))
      return false;
    if(JSON.stringify(assoc1.evidence_subset_closure) != JSON.stringify(assoc2.evidence_subset_closure))
      return false;
    if(JSON.stringify(assoc1.evidence_type_closure) != JSON.stringify(assoc2.evidence_type_closure))
      return false;
    if(JSON.stringify(assoc1.publications) != JSON.stringify(assoc2.publications))
      return false;
    if(assoc1.reference && assoc2.reference)
      if(JSON.stringify(assoc1.reference) != JSON.stringify(assoc2.reference))
        return false;
    if(JSON.stringify(assoc1.provided_by) != JSON.stringify(assoc2.provided_by))
      return false;
    if(assoc1.evidence_with && assoc2.evidence_with) 
      return JSON.stringify(assoc1.evidence_with) != JSON.stringify(assoc2.evidence_with);
    return true;
  }

  sameAssociation(assoc1, assoc2) {
    if(!this.sameEntity(assoc1.subject, assoc2.subject))
      return false;
    if(!this.sameEntity(assoc1.object, assoc2.object))
      return false;
    if(assoc1.negated != assoc2.negated)
      return false;
    if(assoc1.qualifier && assoc2.qualifier)
      return JSON.stringify(assoc1.qualifier) == JSON.stringify(assoc2.qualifier)
    if(assoc1.slim && assoc2.slim)
      return JSON.stringify(assoc1.slim) == JSON.stringify(assoc2.slim)
    return true;
  }

  evidenceAssociationKey(assoc) {
    return this.associationKey(assoc) + "@" + assoc.evidence_type;    
  }
  
  associationKey(assoc) {
    if(assoc.qualifier) {
      return assoc.subject.id + "@" + assoc.object.id + "@" + assoc.negated + "@" + assoc.qualifier.join("-");      
    }
    return assoc.subject.id + "@" + assoc.object.id + "@" + assoc.negated;
  }

  /**
   * Group association based on the keys (subject , object) and (optional) qualifier
   * @param {*} assoc_data 
   */
  groupAssociations(assoc_data) {
    var grouped_map = new Map();
    for(var assoc of assoc_data) {
      var key = this.associationKey(assoc);
      var array = []
      if(grouped_map.has(key)) {
        array = grouped_map.get(key);
      } else {
        grouped_map.set(key, array);
      }
      array.push(assoc);
    }
    return grouped_map;
  }

  concatMaps(map1, map2) {
    var map = new Map();
    for(var key of map1.keys()) {
      map.set(key, map1.get(key));
    }
    for(var key of map2.keys()) {
      if(map.has(key)) {
        var current = map.get(key);
        var array = map2.get(key);
        for(var item of array) {
          current.push(item);
        }
        // console.log("concatenated map: (" , key , "): ", current);
      } else {
        map.set(key, map2.get(key));
      }
    }
    return map;
  }

  mergeEvidences(grouped_map) {
    var merged = []
    for(var [key, group] of grouped_map.entries()) {
      // console.log("group: ", group);
      if(group.length == 1) {
        merged.push(group[0])
      } else {
        // merge evidences
        var evidence_map = new Map();
        for(var i = 0; i < group.length; i++) {
          // console.log("group(" + i + "): ", group[i].evidence_map);
          evidence_map = this.concatMaps(evidence_map, group[i].evidence_map);
        }
        
        // console.log("group-0: ", group[0]);
        // console.log("using: ", evidence_map);
        group[0].evidence_map = evidence_map;
        // console.log("group-0-a: ", group[0]);

        // merge publications
        var pubs = new Set();
        for(var i = 0; i < group.length; i++) {
          if(group[i].publications) {
          for(var pub of group[i].publications) {
            pubs.add(pub);
          }
          }
        }
        group[0].publications = Array.from(pubs);

        // merge references
        var refs = new Set();
        for(var i = 0; i < group.length; i++) {
          if(group[i].reference) {
          for(var ref of group[i].reference) {
            refs.add(ref);
          }
          }
        }
        group[0].reference = Array.from(refs);

        merged.push(group[0]);
      }
    }
    return merged
  }



  /** 
   * build from the association response of BioLink
  */
  buildEvidenceMap() {
    console.log("assoc_data: ", this.state.selected.data);
    for(var assoc of this.state.selected.data) {
      assoc.evidence_map = new Map();
        assoc.evidence_map.set(assoc.evidence, [
          {
            evidence_id : assoc.evidence,
            evidence_type : assoc.evidence_type,
            evidence_label : assoc.evidence_label,
            evidence_qualifier : assoc.evidence_qualifier ? assoc.evidence_qualifier : [],
            evidence_with : assoc.evidence_with ? assoc.evidence_with : [],
            evidence_refs : assoc.reference ? assoc.reference.filter(ref => ref.startsWith("PMID:")) : []
          }
        ])
    }

    var grouped_map = this.groupAssociations(this.state.selected.data);
    // console.log("grouped map: ", grouped_map);
    var merged_map = this.mergeEvidences(grouped_map);

    this.setState({ 
      selected : {
        subject : this.state.selected.subject,
        group : this.state.selected.group,
        data : merged_map,
        ready : true
      }
    })
  }

  defaultConfig() {
    return {
      termUrlFormatter : this.subjectBaseURL
    }
  }

  render() {
    // console.log("RENDER: ", this.state);
    return (
      <div style={{ width : '1400px' }}>

        <div>
          <a href="http://geneontology.org/" target="_blank" style={{display : 'inline-block'}}>
            <span>
              <img src="http://geneontology.org/assets/go-logo.large.png" style={{height : '80px'}}/>
            </span>                
          </a>
          <span style={{display: 'block', textAlign: 'center', width: '100%', fontSize: '2rem'}}>Gene Ontology Ribbon</span>
        </div>
      
        <div style={{marginTop: '2rem'}}>
          <b>Enter one or more gene IDs separated by commas or new lines</b><br/><small><i>(e.g. RGD:3889 or MGI:88276, or ZFIN:ZDB-GENE-010320-2,HGNC:6876, etc)</i></small><br/>
          <textarea rows="5" cols="70" value={this.state.search} onChange={(event) => this.setState({ search: event.target.value })}/>
          <span style={{display: 'block'}}>
            <button onClick={this.addGenes.bind(this)} style={{display : 'inline-block', fontSize: '1rem', marginRight: '1rem'}} title="Enter one or more gene IDs separated by commas or new lines">Add Gene(s)</button>
            <button onClick={this.clearGenes.bind(this)} style={{display : 'inline-block', fontSize: '1rem'}} title="Clear current GO ribbon">Clear All</button>
          </span>
        </div>

            
            { 
              <div style={{marginTop: '2rem'}}>{
              (this.state.loading)
                  ? "Loading..." 
                  : 
                  
                  <GenericRibbon    categories={this.state.ribbon.categories} 
                                    subjects={this.state.ribbon.subjects} 

                                    selected={this.state.selected}
                                    selectionMode={this.state.selectionMode}
                                    hideFirstSubjectLabel={false}
                                    subjectUseTaxonIcon={true}
                                    subjectLabelPosition={POSITION.LEFT}
                                    colorBy={COLOR_BY.CLASS_COUNT}
                                    subjectBaseURL={this.state.subjectBaseURL}
                                    
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
                                      oddEvenColor={true}
                                      borderBottom={true}
                                      focalblock={null}
                                      tableLabel={"GO annotations"}
                                      termURL={"http://amigo.geneontology.org/amigo/term/"}
                                      termInNewPage={true}
                                      provided_list={this.state.selected.data}
                                      />
                  : ""
           }
          </div>
           }
        </div>
    )
  }

  handleChange(event) {
    this.setState({ search : event.target.value });
  }

  getSubjectItem(subject_id, group_id) {
    for(let sub of this.state.ribbon.subjects) {
      if(sub.id == subject_id) {
        return sub.groups[group_id];
      }
    }
  }

  filterOther(assocs, subjects, group) {
    console.log("assocs: ", assocs);
    console.log("group: ", group);

    // Hard coded subjects[0]
    var subject_id = subjects[0];
    console.log("subject_id: ", group.id + (group.type == "Other" ? "-other" : "") , subject_id);
    var item = this.getSubjectItem(subject_id, group.id + (group.type == "Other" ? "-other" : ""));
    console.log("item: ", item);
    
    var filteredAssocs = [];
    for(let assoc of assocs) {
      if(item.ALL.terms.includes(assoc.object.id)) {
        filteredAssocs.push(assoc);
      }
    }
    return filteredAssocs;
  }
  
  addGenes() {
    // console.log("Test button activated (" , this.state.search + ")");
    var subjects = this.state.search;
    if(subjects.includes(",")) { subjects = subjects.split(","); }
    if(subjects.includes("\n")) { subjects = subjects.split("\n"); }
    this.fetchData("goslim_agr", subjects)
    .then(data => {
      var oldSubs = this.state.ribbon.subjects;
      for(var sub of data.data.subjects) {
        oldSubs.push(sub);
      }
      this.setState({ loading : false, subjects : oldSubs })
    })
  }

  clearGenes() {
    this.fetchData("goslim_agr", undefined)
    .then(data => {
      this.setState({ loading : false, ribbon : data.data })
    })
  
  
    // this.setState({
    //   loading : true,
    //   subjectBaseURL : this.props.subjectBaseURL,
    //   selected : {
    //     subject : null,
    //     group : null,
    //     data : null,
    //     ready : false,
    //   },
    //   search : ""
    // });
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
    console.log("ITEM CLICK: subject: ", subject , "group: ", group, "state.group: ", this.state.selected.group);

    var subjects = []
    if(this.state.selectionMode == SELECTION.COLUMN) {
      // console.log("COLUMN SELECTION MODE: " , this.state.ribbon.subjects);
      for(let sub of this.state.ribbon.subjects) {
        subjects.push(sub.id);
      }
      // console.log("subjects: ", subjects);
    } else {
      subjects.push(subject.id);
    }


    if(this.state.selected.group) {
        var sameGroupID = group.id == this.state.selected.group.id;
        var sameGroupType = group.type == this.state.selected.group.type
        var sameSubject = subjects.length > 1 || (subject.id == this.state.selected.subject.id);
        if(sameGroupID && sameGroupType && sameSubject) {
          group = undefined;
      }
    }

    this.setState({ selected : {
      subject : subject,
      group : group,
      data : null,
      ready : false
    }})

    if(group) {
      this.fetchAssociationData(subjects, group.id)
      .then(data => {
        console.log("retrieved data: " , data);
        var sorted_assocs = data.data[0].assocs;
        sorted_assocs.sort((a, b)=> a.object.label.localeCompare(b.object.label))
        if(group.type == "Other") {
          sorted_assocs = this.filterOther(sorted_assocs, subjects, group);
          console.log("Filtered assocs: ", sorted_assocs);
        }
        var filtered = sorted_assocs;
        if(this.state.excludePB) {
          filtered = this.filterPB(filtered);
        }
        if(this.state.onlyEXP) {
          filtered = this.getEXP(filtered);
        }
        if(!this.state.crossAspect) {
          filtered = this.filterCrossAspect(group, filtered);
        }
        this.setState({ selected : {
          subject : subject,
          group : group,
          data : filtered, // assoc data from BioLink
          ready : false
        }})
        this.buildEvidenceMap();
      })
    }
  }


  filterPB(assocs) {
    var list = [];
    for(var assoc of assocs) {
      if(assoc.object.id != 'GO:0005515') {
        list.push(assoc);
      }
    }
    return list;
  }

  getEXP(assocs) {
    var list = [];
    for(var assoc of assocs) {
      if(assoc.evidence_type in exp_codes) {
        list.push(assoc);
      }
    }
    return list;
  }

  getAspect(group) {
    for(let cat of this.state.ribbon.categories) {
      let found = cat.groups.filter(elt => {
        return elt.id == group.id;
      });
      if(found.length > 0) {
        return [ cat.id , cat.label ];
      }
    }
    return undefined;
  }

  filterCrossAspect(group, assocs) {
    var list = [];
    var aspect = this.getAspect(group);
    for(var assoc of assocs) {
      let cat = assoc.object.category[0] == 'molecular_activity' ? 'molecular_function' : assoc.object.category[0];
      if(cat == aspect[1]) {
        list.push(assoc);
      }
    }
    return list;
  }  

}

Demo2.propTypes = {
  mode: PropTypes.string,
  selectionMode : PropTypes.number,
  subjectBaseURL : PropTypes.string,
  subject: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ])
};

Demo2.defaultProps = {
  subjectBaseURL : "http://amigo.geneontology.org/amigo/gene_product/",
  selectionMode : SELECTION.CELL
  // subjectBaseURL : "https://www.alliancegenome.org/gene/"
}





/*
 * We use the addUrlProps higher-order component to map URL query parameters
 * to props for Demo. In this case the mapping happens automatically by
 * first decoding the URL query parameters based on the urlPropsQueryConfig.
 */
export default addUrlProps({ mapUrlToProps })(Demo2);

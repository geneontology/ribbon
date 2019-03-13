'use strict';

import taxa from './data/taxa';
import getKey from './assocKey';

import axios from 'axios';


// Enum for Slim Block Type - All is all annotations, Item contains a single slim data, Other are for unmapped terms, Aspect is for the general class representation, AllFromAspects gather all the annotations for that aspect / category
var SlimType = { "All": 0, "Item": 1, "Other": 2, "Aspect": 3, "AllFromAspect": 4 }
Object.freeze(SlimType)
export { SlimType };


const prefixToSpecies = {
  'HGNC': 'Homo sapiens',  // human
  'UniProtKB': 'Homo sapiens',  // human
  'MGI': 'Mus musculus',  // mouse
  'RGD': 'Rattus norvegicus',  // rat
  'ZFIN': 'Danio rerio',  // zebrafish
  'FB': 'Drosophila melanogaster',  // fly
  'FlyBase': 'Drosophila melanogaster',  // fly
  'WB': 'Caenorhabditis elegans',  // worm
  'SGD': 'Saccharomyces cerevisiae',  // yeast
};

export function getPrefixForId(inputId) {

  let idSplit = inputId.split(':');

  if (idSplit.length === 0)
    return null;

  return prefixToSpecies[idSplit[0]];

}

// we still exclude protein binding term
const irrelevantTerms = [ "GO:0005515" ];


function addEvidence(prev_assoc, assocItem, filters) {
  var evidence_group;
  let evidence_id = assocItem.evidence;
  /* hack until issue ##182 is resolved in ontobio */
  if (assocItem.reference !== undefined) {
    if (!filters.has(assocItem.evidence_type)) {
      filters.set(assocItem.evidence_type, true);
    }
    let withs = assocItem.evidence_with !== undefined ? assocItem.evidence_with : [];
    let quals = assocItem.qualifier !== undefined ? assocItem.qualifier : [];
    evidence_group = {
      evidence_id: evidence_id, // just for convenience
      evidence_type: assocItem.evidence_type,
      evidence_label: assocItem.evidence_label,
      evidence_qualifier: quals,
      evidence_with: withs,
      evidence_refs: filterDuplicateReferences(assocItem.reference), // this is an array
    };
  } else {
    if (!filters.has(assocItem.evidence_label[0])) {
      filters.set(assocItem.evidence_label[0], true);
    }
    evidence_group = {
      evidence_id: evidence_id, // just for convenience
      evidence_type: assocItem.evidence_label[0],
      evidence_label: assocItem.evidence_label[0],
      evidence_qualifier: [],
      evidence_with: [],
      evidence_refs: filterDuplicatePublications(assocItem.publications),
    };
  }
  var e_map = prev_assoc.evidence_map;
  if (e_map === undefined) {
    e_map = new Map();
    prev_assoc.evidence_map = e_map;
  }
  var e_groups = e_map.get(evidence_id);
  if (e_groups === undefined) {
    e_map.set(evidence_id, [evidence_group]);
  } else {
    e_groups.push(evidence_group);
  }
}

export function unpackSlimItems(results, subject, config) {

  return new Promise(function (resolve, reject) {

    let associations = [];
    results.forEach(function (result) {
      if (result.data.length > 0) {
        // merge these assocs into the overall response to this query
        Array.prototype.push.apply(associations, result.data);
      }
    });

    let terms = new Set();
    associations.forEach(elt => {
      terms.add(elt.slim);
      elt.assocs.forEach(elt2 => {
        terms.add(elt2.object.id);
      });
    })

    // Temporary fix with an API able to send back the aspects of a list of GO terms
    let url = "https://ksmod2v1qk.execute-api.us-west-1.amazonaws.com/prod/function?ids=" + Array.from(terms).join(",");
    let termAspect = new Map();
    axios.get(url)
    .then(function (response) {
      Object.keys(response.data).forEach(elt => {
        termAspect.set(elt, response.data[elt]);
      })
      resolve({ associations: associations, termAspect: termAspect });
    })
    .catch(function (error) {
      console.error(error);
      reject(error);
    })
  });

}

export function createSlims(subject, config, associations, termAspect) {
  let label = subject;
  let filters = new Map();
  let other = false;
  let globalclass_ids = [];
  let seen_before_in_slim = new Map;
  let taxon = "N/A";

  // list in config, for instance linking to agr file
  // we need a deep copy, not a shallow copy for this function to be stateless (e.g. for multiple GPs)
  var slimlist = JSON.parse(JSON.stringify(config.slimlist));


  let all_block = {
    'class_id': 'All annotations',
    'class_label': 'All annotations',
    'uniqueAssocs': [],
    'uniqueIDs': [],
    'color': config.highlightColor,
  };
  var aspect;
  var aspect_ids;
  let aspects = new Set();

  let slimterm;

  // 1 - we travel through all slims individually
  const blocks = slimlist.map(function (slimitem) {
    // set up uniques and color too
    slimitem.uniqueIDs = [];
    slimitem.uniqueAssocs = [];
    slimitem.nbAnnotations = 0;
    slimitem.color = '#fff';

    other = slimitem.class_label.toLowerCase().includes('other');
    slimitem.type = other ? SlimType.Other : SlimType.Item;

    if (slimitem.class_id.toLowerCase().indexOf('aspect') >= 0) {
      if (aspect !== undefined) {
        aspect.uniqueAssocs.sort(sortAssociations);
      }
      slimitem.aspect = slimitem.class_id.split(" ")[0];
      slimitem.type = SlimType.Aspect;
      aspect = slimitem;
      aspect_ids = [];
      slimitem.no_data = false;
      aspects.add(aspect);
    }

    slimitem.aspect = aspect.aspect;

    // getting the associations for that slim
    let slim_associations = associations.find(elt => {
      return elt.slim == slimitem.class_id;
    })

    // no association found
    if (!slim_associations) return slimitem;

    // check all associations for that slim
    for (let assocItem of slim_associations.assocs) {
      // If No Data, do nothing
      if (assocItem.evidence_type === 'ND') continue;

      // If term is irrelevant, do nothing
      if (irrelevantTerms.includes(assocItem.object.id)) continue;

      // If term is not from the same aspect as this section (e.g. through trans-aspect relationships), do not include
      if (termAspect && termAspect.get(slimitem.aspect) != termAspect.get(assocItem.object.id)) continue;

      // Temp fix of FlyBase ID
      let subjectID = assocItem.subject.id.replace('FlyBase', 'FB');
      assocItem.subject.id = subjectID;

      // Actually needed only once
      label = assocItem.subject.label;
      taxon = assocItem.subject.taxon.id;

      // create unique key (subject - annotation)
      let key = getKey(assocItem);

      // if this key has never been seen, keep it and add this assoc to all_block
      if (!globalclass_ids.includes(key)) {
        globalclass_ids.push(key);
        all_block.uniqueAssocs.push(assocItem);
      }

      var need2add_evidence;
      let earlier_slim = seen_before_in_slim.get(key);
      if (earlier_slim === undefined) {
        seen_before_in_slim.set(key, slimitem);
        need2add_evidence = true;
      } else {
        need2add_evidence = (earlier_slim === slimitem);
      }

      // if term not yet seen, add it to the slim
      if (!slimitem.uniqueIDs.includes(key)) {
        if (slimitem.type == SlimType.Other) {
          if (!aspect_ids.includes(key)) {
            slimitem.uniqueIDs.push(key);
            slimitem.uniqueAssocs.push(assocItem);
          }

        } else {
          slimitem.uniqueIDs.push(key);
          slimitem.uniqueAssocs.push(assocItem);
          if (slimitem != aspect) {
            aspect_ids.push(key);
            aspect.uniqueAssocs.push(assocItem);
            aspect.uniqueIDs.push(key);
          }
        }

        if (need2add_evidence) {
          assocItem.evidence_map = new Map();
          addEvidence(assocItem, assocItem, filters);
        } else {
          let prev_assoc = all_block.uniqueAssocs[globalclass_ids.indexOf(key)];
          assocItem.evidence_map = prev_assoc.evidence_map;
        }

        // If term already seen, just check if the evidence can still be added
      } else {
        if (need2add_evidence) {
          let prev_assoc = all_block.uniqueAssocs[globalclass_ids.indexOf(key)];
          addEvidence(prev_assoc, assocItem, filters);
        }

      }
    }

    if (slimitem.uniqueAssocs.length > 0) {
      slimitem.uniqueAssocs.sort(sortAssociations);
      slimitem.nbAnnotations = countAnnotations(slimitem);
    }
    return slimitem;
  });

  if (aspect !== undefined) {
    aspect.uniqueAssocs.sort(sortAssociations);
  }
  // insert a block with all annotations at the very first position
  if (all_block.uniqueAssocs.length > 0) {
    all_block.class_label = 'All annotations';
    all_block.uniqueAssocs.sort(sortAssociations);
    all_block.nbAnnotations = countAnnotations(all_block);
    all_block.type = SlimType.All;
  }
  blocks.splice(0, 0, all_block);


  // adding ALL <aspect> category at the beginning of each block of slims
  for (let asp of aspects) {
    let aspectPos = blocks.findIndex(elt => {
      return elt.aspect == asp.aspect && elt.type == SlimType.Aspect;
    });

    let aspectItem = blocks[aspectPos];
    let aspectAllItem = gatherAllAnnotations(aspectItem, blocks, config);

    let otherPos = blocks.findIndex(elt => {
      return elt.aspect == asp.aspect && elt.type == SlimType.Item;
    });
    blocks.splice(otherPos, 0, aspectAllItem);
  }

  return {
    blocks: blocks,
    filters: filters,
    label: label,
    taxon: taxon
  };
}

/**
 * Create a slim item regrouping all the annotations & IDs for a given aspect
 * @param {*} aspectItem 
 * @param {*} blocks 
 */
function gatherAllAnnotations(aspectItem, blocks, config) {
  let slimitem = {};
  slimitem.uniqueIDs = [];
  slimitem.uniqueAssocs = [];
  slimitem.nbAnnotations = 0;
  slimitem.color = '#fff';
  slimitem.class_label = "All " + aspectItem.class_label.toLowerCase();
  slimitem.class_id = aspectItem.aspect + " all";
  slimitem.aspect = aspectItem.aspect;
  slimitem.type = SlimType.AllFromAspect;

  let setIDs = new Set();
  let setAssocs = new Set();
  for (let block of blocks) {
    if (block.aspect === aspectItem.aspect) {
      for (let id of block.uniqueIDs) {
        setIDs.add(id);
      }

      for (let id of block.uniqueAssocs) {
        setAssocs.add(id);
      }
    }
  }
  slimitem.uniqueIDs = Array.from(setIDs);
  slimitem.uniqueAssocs = Array.from(setAssocs);

  if (slimitem.uniqueAssocs.length > 0) {
    slimitem.uniqueAssocs.sort(sortAssociations);
    slimitem.nbAnnotations = countAnnotations(slimitem);
  }

  return slimitem;
}

function countAnnotations(slimitem) {
  let count = 0;
  slimitem.uniqueAssocs.forEach(elt => {
    elt.evidence_map.forEach((v, k) => {
		count += v.length;
    })
  })  
  return count;
}


function sortAssociations(assoc_a, assoc_b) {
  let taxa_ids = Array.from(taxa.keys());
  let index_a = taxa_ids.indexOf(assoc_a.subject.taxon.id);
  let index_b = taxa_ids.indexOf(assoc_b.subject.taxon.id);
  if (index_a < index_b) {
    return -1;
  }
  if (index_a > index_b) {
    return 1;
  }
  if (assoc_a.subject.id < assoc_b.subject.id) {
    return -1;
  }
  if (assoc_a.subject.id > assoc_b.subject.id) {
    return 1;
  }
  if (assoc_a.object.label.toLowerCase() < assoc_b.object.label.toLowerCase()) {
    return -1;
  }
  if (assoc_a.object.label.toLowerCase() > assoc_b.object.label.toLowerCase()) {
    return 1;
  }
  // a must be equal to b
  return 0;
}



/**
 *
 * @param references
 * @returns {*}
 */
function filterDuplicateReferences(reference) {
  // if references contains a PMID, remove the non-PMID ones
  let returnArray = reference.filter(function (r) {
    if (r.startsWith('PMID:')) {
      return true;
    } else {
      return false;
    }
  });
  if (returnArray.length === 0) {
    returnArray.push(reference[0]);
  }
  return returnArray;
}

/**
 *
 * @param references
 * @returns {*}
 */
function filterDuplicatePublications(publications) {

  // if references contains a PMID, remove the non-PMID ones
  let returnArray = [];
  if (publications !== null && publications !== undefined) {
    publications.filter(function (pub) {
      if (pub.id.startsWith('PMID:') && !returnArray.includes(pub.id)) {
        returnArray.push(pub.id);
        return true;
      } else {
        return false;
      }
    });
    if (returnArray.length === 0) {
      returnArray.push(publications[0].id);
    }
  }
  return returnArray;
}

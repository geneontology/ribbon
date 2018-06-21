import taxa from './data/taxa';

const assocColor = [63, 81, 181];

Object.defineProperty(Array.prototype, 'unique', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function () {
        let a = this.concat();
        for (let i = 0; i < a.length; ++i) {
            for (let j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j] || a[j] === undefined)
                    a.splice(j--, 1);
            }
        }
        a = a.filter(x => x != null);

        return a;
    }
});

function isNegate(assoc) {
  return (assoc.qualifier && assoc.qualifier.length === 1 && assoc.qualifier[0] === 'not');
}

/*
  Have to deal with GO and Monarch differences in the JSON to display either function or phenotypes
  GO uses evidence_type (3 letter code) and Monarch evidence_label.
*/
function getKeyForObject(assoc) {
  return isNegate(assoc) ? 'neg::' + assoc.subject.id + '-' + assoc.object.id : assoc.subject.id + '-' + assoc.object.id;
}

function addEvidence(prev_assoc, assocItem) {
  var evidence_group;
  let evidence_id = assocItem.evidence;
  /* hack until issue ##182 is resolved in ontobio */
  if (assocItem.reference !== undefined) {
    let withs = assocItem.evidence_with !== undefined ? assocItem.evidence_with : [];
    evidence_group = {
      evidence_id: evidence_id, // just for convenience
      evidence_type: assocItem.evidence_type,
      evidence_label: assocItem.evidence_label,
      evidence_with: withs,
      evidence_refs: filterDuplicateReferences(assocItem.reference), // this is an array
    }
  } else {
    evidence_group = {
      evidence_id: evidence_id, // just for convenience
      evidence_type: assocItem.evidence_label[0],
      evidence_label: assocItem.evidence_label[0],
      evidence_with: [],
      evidence_refs: filterDuplicatePublications(assocItem.publications),
    }
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

export function unpackSlimItems(results, subject, slimlist) {
  let title = subject;
  let queryResponse = [];
  let other = false;
  let globalclass_ids = [];
  let seen_before_in_slim = new Map;

  let all_block = {
      "class_id": "All annotations",
      "class_label": "All annotations",
      "uniqueAssocs": [],
  //    "color": "#D0A825",
      "color": "#8BC34A",
  };

  results.forEach(function (result) {
    if (result.data.length > 0) {
      // merge these assocs into the overall response to this query
      Array.prototype.push.apply(queryResponse, result.data);
    }
  });

  var aspect;
  var aspect_ids;

  /*
  bulk of the annotations initialized first
  */
  const blocks = slimlist.map(function (slimitem) {
    // set up uniques and color too
    slimitem.uniqueIDs = [];
    slimitem.uniqueAssocs = [];
    slimitem.color = "#fff";

    other = slimitem.class_label.includes('other');

    if (slimitem.class_id.startsWith('aspect')) {
      aspect = slimitem;
      aspect_ids = [];
    }

    queryResponse.forEach(function (response) {
      if (response.assocs.length > 0) {
        // these are all the assocs under this slim class
        // we don't want the association map, just those for this slim
        if (response.slim === slimitem.class_id) {
          slimitem.uniqueAssocs = response.assocs.filter(function (assocItem) {
            // skip noninformative annotations like protein binding
            for (let i = response.assocs.length - 1; i >= 0; i--) {
              let assoc = response.assocs[i];
              if (assoc.object.id === 'GO:0005515') {
                return false;
              }
            }
            /*
              First a hack to accommodate swapping out HGNC ids for UniProtKB ids
            */
            if (subject.startsWith('HGNC') && assocItem.subject.taxon.id === 'NCBITaxon:9606') {
              assocItem.subject.id = subject; // Clobber the UniProtKB id
            }
            /*
              Then another interim hack because of differences in resource naming
              e.g. FlyBase === FB
            */
            let subjectID = assocItem.subject.id.replace('FlyBase', 'FB');
            assocItem.subject.id = subjectID;
            if (subjectID === subject) {
              title = assocItem.subject.label + ' (' + assocItem.subject.id + ')';
            }

            /* any given association may appear under >1 slim,
              but we only want to record the evidence for that assoc once
              so keep track of whether it's already been seen in another slim here
            */
            var need2add_evidence;
            let key = getKeyForObject(assocItem);
            let earlier_slim = seen_before_in_slim.get(key);
            if (earlier_slim === undefined) {
              seen_before_in_slim.set(key, slimitem);
              need2add_evidence = true;
            } else {
              need2add_evidence = (earlier_slim === slimitem);
            }

            if (!slimitem.uniqueIDs.includes(key)) {
              /*
                The test below is assuming that the 'other' block is always at
                the end of the strip for a particular aspect
              */
              if (!other || (other && !aspect_ids.includes(key))) {
                slimitem.uniqueIDs.push(key);
              } else {
                return false;
              }
              if (!globalclass_ids.includes(key)) {
                globalclass_ids.push(key);
                all_block.uniqueAssocs.push(assocItem);
              }
              if (aspect && !aspect_ids.includes(key)) {
                aspect_ids.push(key);
                aspect.uniqueAssocs.push(assocItem);
              }
              if (need2add_evidence) {
                assocItem.evidence_map = new Map();
                addEvidence(assocItem, assocItem);
              } else {
                let prev_assoc = all_block.uniqueAssocs[globalclass_ids.indexOf(key)];
                assocItem.evidence_map = prev_assoc.evidence_map;
              }
              return true;
            } else {
              if (need2add_evidence) {
                let prev_assoc = all_block.uniqueAssocs[globalclass_ids.indexOf(key)];
                addEvidence(prev_assoc, assocItem);
              }
              return false;
            }
          });
          if (slimitem.uniqueAssocs.length > 0) {
            slimitem.uniqueAssocs.sort(sortAssociations);
            slimitem.uniqueAssocs = subjectFirst(subject, slimitem.uniqueAssocs);
            slimitem.color = heatColor(slimitem.uniqueAssocs.length, assocColor, 48);
          }
        }
      }
    });
    return slimitem;
  });

  // insert a block with all annotations at the very first position
  if (all_block.uniqueAssocs.length > 0) {
    all_block.class_label = 'All ' + all_block.uniqueAssocs.length + ' annotations';
    all_block.uniqueAssocs.sort(sortAssociations);
  }
  blocks.splice(0, 0, all_block);
  return {
      title: title,
      blocks: blocks,
  };
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
    if (assoc_a.object.label < assoc_b.object.label) {
        return -1;
    }
    if (assoc_a.object.label > assoc_b.object.label) {
        return 1;
    }
    // a must be equal to b
    return 0;
}

function subjectFirst(subject, uniqueAssocs) {
    let subjectAssocs = [];
    for (let i = uniqueAssocs.length - 1; i >= 0; i--) {
        let assoc = uniqueAssocs[i];
        if (assoc.subject.id === subject) {
            // remove this from current list
            uniqueAssocs.splice(i, 1);
            // add it to the top of the revised list
            subjectAssocs.splice(0, 0, assoc);
        }
    }
    // now collect the remaining associations to orthologs
    return subjectAssocs.concat(uniqueAssocs);
}

export function heatColor(associations_count, rgb, heatLevels) {
    if (associations_count === 0)
        return "#fff";
    let blockColor = [];     // [r,g,b]
    for (let i = 0; i < 3; i++) {
        // logarithmic heatmap (with cutoff)
        if (associations_count < heatLevels) {
            // instead of just (256-rgb[i])/(Math.pow(2,associations_count)),
            // which divides space from 'white' (255) down to target color level in halves,
            // this starts at 3/4
            const heatCoef = 3 * (256 - rgb[i]) / (Math.pow(2, associations_count + 1));
            blockColor[i] = Math.round(rgb[i] + heatCoef);
        }
        else {
            blockColor[i] = rgb[i];
        }
    }
    return 'rgb(' + blockColor[0] + ',' + blockColor[1] + ',' + blockColor[2] + ')';
}

function containsPMID(references) {
    for (let r of references) {
        if (r.startsWith('PMID:')) return true;
    }
    return false;
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

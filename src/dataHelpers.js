import taxa from './data/taxa';
import getKey from './assocKey';

function addEvidence(prev_assoc, assocItem, ecoList) {
  var evidence_group;
  if (!ecoList.has(assocItem.evidence_type)) {
    ecoList.set(assocItem.evidence_type, true);
  }
  let evidence_id = assocItem.evidence;
  /* hack until issue ##182 is resolved in ontobio */
  if (assocItem.reference !== undefined) {
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
  let title = subject;
  let ecoList = {};
  let queryResponse = [];
  let other = false;
  let globalclass_ids = [];
  let seen_before_in_slim = new Map;
  let slimlist = config.slimlist;

  let all_block = {
    'class_id': 'All annotations',
    'class_label': 'All annotations',
    'uniqueAssocs': [],
    'uniqueIDs': [],
    'color': config.highlightColor,
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
    slimitem.color = '#fff';

    other = slimitem.class_label.toLowerCase().includes('other');

    if (slimitem.class_id.toLowerCase().indexOf('aspect') >= 0) {
      if (aspect !== undefined) {
        aspect.uniqueAssocs.sort(sortAssociations);
      }
      aspect = slimitem;
      aspect_ids = [];
      slimitem.no_data = false;
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
              assocItem.subject.id = subject; // Clobber the UniProtKB id bioLink returns
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
            let key = getKey(assocItem);
            let earlier_slim = seen_before_in_slim.get(key);
            if (earlier_slim === undefined) {
              seen_before_in_slim.set(key, slimitem);
              need2add_evidence = true;
            } else {
              need2add_evidence = (earlier_slim === slimitem);
            }
            if (!slimitem.uniqueIDs.includes(key)) {
              if (assocItem.evidence_type === 'ND') {
                aspect.no_data = true;
                return false;
              }
              /*
                The test below is assuming that the 'other' block is always at
                the end of the strip for a particular aspect
              */
              if (!other || (other && !aspect_ids.includes(key))) {
                slimitem.uniqueIDs.push(key);
              } else {
                return false;
              }
              if (!globalclass_ids.includes(key) && !aspect.no_data) {
                globalclass_ids.push(key);
                all_block.uniqueAssocs.push(assocItem);
              }
              if (aspect && !aspect_ids.includes(key) && !aspect.no_data) {
                aspect_ids.push(key);
                aspect.uniqueAssocs.push(assocItem);
                aspect.uniqueIDs.push(key);
              }
              if (need2add_evidence) {
                assocItem.evidence_map = new Map();
                addEvidence(assocItem, assocItem, ecoList);
              } else {
                let prev_assoc = all_block.uniqueAssocs[globalclass_ids.indexOf(key)];
                assocItem.evidence_map = prev_assoc.evidence_map;
              }
              return true;
            } else {
              if (need2add_evidence) {
                let prev_assoc = all_block.uniqueAssocs[globalclass_ids.indexOf(key)];
                addEvidence(prev_assoc, assocItem, ecoList);
              }
              return false;
            }
          });
          if (slimitem.uniqueAssocs.length > 0) {
            slimitem.uniqueAssocs.sort(sortAssociations);
            //          slimitem.uniqueAssocs = subjectFirst(subject, slimitem.uniqueAssocs);
            slimitem.color = heatColor(slimitem.uniqueAssocs.length, config.annot_color, config.heatLevels);
          }
        }
      }
    });
    return slimitem;
  });

  if (aspect !== undefined) {
    aspect.uniqueAssocs.sort(sortAssociations);
  }
  // insert a block with all annotations at the very first position
  if (all_block.uniqueAssocs.length > 0) {
    all_block.class_label = 'Annotated to ' + all_block.uniqueAssocs.length + ' classes';
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
  if (assoc_a.object.label.toLowerCase() < assoc_b.object.label.toLowerCase()) {
    return -1;
  }
  if (assoc_a.object.label.toLowerCase() > assoc_b.object.label.toLowerCase()) {
    return 1;
  }
  // a must be equal to b
  return 0;
}

export function heatColor(associations_count, hexColor, heatLevels) {
  if (associations_count === 0)
    return '#fff';

  let rgb = hexColor.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16));

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

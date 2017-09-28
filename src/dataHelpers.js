import taxa from './data/taxa';

const queryRGB = [0, 96, 96];
const orthoRGB = [255, 185, 36];
const queryColor = "#e5efef"; //"#c0d8d8";
const orthoColor = "#fff8e9"; //"#ffeec9";

export function unpackSlimItems(results, subject, slimlist) {
  var title = subject;
  var queryResponse = [];
  var others = [];
  var allGOids = [];
  results.forEach(function(result) {
    if (result.data.length > 0) {
      // merge these assocs into the overall response to this query
      Array.prototype.push.apply(queryResponse, result.data);
    }
  });
  /*
  bulk of the annotations initialized first
  */
  const blocks = slimlist.map(function(slimitem) {
    if (slimitem.golabel.includes('other')) {
      others.push(slimitem);
    }
    var assocs = [];
    queryResponse.forEach(function(response) {
      if (response.slim === slimitem.goid) {
        // skip noninformative annotations like protein binding
        for (var i = response.assocs.length - 1; i >= 0; i--) {
          var assoc = response.assocs[i];
          if (assoc.object.id === 'GO:0005515' ||
              assoc.object.id === 'GO:0003674' ||
              assoc.object.id === 'GO:0008150' ||
              assoc.object.id === 'GO:0005575') {
            response.assocs.splice(i, 1);
          }
        }
        // these are all the assocs under this slim class
        Array.prototype.push.apply(assocs, response.assocs);
        /*
        keep track of which associations are found for slim classes
        so that (after this loop) these can be removed from "other"'s list
        */
        if (!slimitem.golabel.includes('other')) {
          assocs.forEach(function(assoc) {
            allGOids.push(assoc.object.id);
          })
        }
      }
    });
    // set up uniques and color too
    var block_color = orthoRGB;
    slimitem.uniqueAssocs = [];
    if (assocs.length > 0) {
      var hits = [];
      slimitem.uniqueAssocs = assocs.filter(function(assocItem, index) {
        /*
          Short term interim hack because of differences in resource naming
          e.g. FlyBase === FB
        */
        var subjectID = assocItem.subject.id.replace('FlyBase', 'FB');
        assocItem.subject.id = subjectID;
        if (subjectID === subject) {
          title = assocItem.subject.label + ' (' +
                  assocItem.subject.taxon.label + ')';
          block_color = queryRGB;
        }
        var label = assocItem.subject.id + ': ' + assocItem.object.label;
        if (!hits.includes(label)) {
          hits.push(label);
          return true;
        } else {
          return false;
        }
      });
      slimitem.uniqueAssocs.sort(sortAssociations);
      slimitem.uniqueAssocs = subjectFirst(subject, slimitem.uniqueAssocs);
      slimitem.color = heatColor(slimitem.uniqueAssocs.length, block_color, 48);
      slimitem.tree = buildAssocTree(slimitem.uniqueAssocs, subject);
    } else {
      slimitem.color = "#fff";
      slimitem.tree = undefined;
    }
    return slimitem;
  });
  others.forEach(function(otherItem) {
    for (var i = otherItem.uniqueAssocs.length - 1; i >= 0; i--) {
      var checkAssoc = otherItem.uniqueAssocs[i];
      if (allGOids.indexOf(checkAssoc.object.id) >= 0) {
        otherItem.uniqueAssocs.splice(i, 1);
      }
    }
    /*
      Need to update the color
    */
    if (otherItem.uniqueAssocs.length > 0) {
      var block_color = orthoRGB;
      var taxon_color = orthoColor;
      otherItem.uniqueAssocs.forEach(function(otherAssoc) {
        if (otherAssoc.subject.id === subject) {
          block_color = queryRGB;
          taxon_color = queryColor;
        }
      })
      otherItem.uniqueAssocs.sort(sortAssociations);
      otherItem.uniqueAssocs = subjectFirst(subject, otherItem.uniqueAssocs);
      otherItem.color = heatColor(otherItem.uniqueAssocs.length, block_color, 48);
      otherItem.tree = buildAssocTree(otherItem.uniqueAssocs, subject);
    } else {
      otherItem.color = "#fff";
      otherItem.tree = undefined;
    }
  });
  return {
    title: title,
    data: blocks
  };
}

function sortAssociations (assoc_a, assoc_b) {
  var taxa_ids = Array.from(taxa.keys());
  var index_a = taxa_ids.indexOf(assoc_a.subject.taxon.id);
  var index_b = taxa_ids.indexOf(assoc_b.subject.taxon.id);
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
  console.log('non-unique list');
  // a must be equal to b
  return 0;
}

function subjectFirst(subject, uniqueAssocs) {
  var subjectAssocs = [];
  for (var i = uniqueAssocs.length -1; i >= 0; i--) {
    var assoc = uniqueAssocs[i];
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
  if( associations_count === 0 )
    return "#fff";
  let blockColor = [];     // [r,g,b]
  for ( var i=0; i<3; i++ ) {
    // logarithmic heatmap (with cutoff)
    if ( associations_count < heatLevels ) {
      // instead of just (256-rgb[i])/(Math.pow(2,associations_count)),
      // which divides space from 'white' (255) down to target color level in halves,
      // this starts at 3/4
      const heatCoef = 3 * (256 - rgb[i]) / (Math.pow(2,associations_count+1));
      blockColor[i] = Math.round( rgb[i] + heatCoef);
    }
    else {
      blockColor[i] = rgb[i];
    }
  }
  return 'rgb('+blockColor[0]+','+blockColor[1]+','+blockColor[2]+')';
}

export function buildAssocTree(assocs, subject) {
  var prev_species = '';
  var prev_gene = '';
  var current_taxon_node;
  var current_gene_node;
  var assocTree = [];

  assocs.forEach(function (assoc) {
    var taxon_color = assoc.subject.id === subject ?
      queryColor : orthoColor;
    if (assoc.subject.taxon.id !== prev_species) {
      current_taxon_node = {
        color: taxon_color,
        about: assoc.subject.taxon,
        children: []
      };
      assocTree.push(current_taxon_node);

      current_gene_node = {
        about: assoc.subject,
        children: []
      };
      current_taxon_node.children.push(current_gene_node);

      var go_node = {
        about: assoc.object,
      }
      current_gene_node.children.push(go_node);

      prev_species = assoc.subject.taxon.id;
      prev_gene = assoc.subject.id;

    } else if (assoc.subject.id !== prev_gene) {
      current_gene_node = {
        about: assoc.subject,
        children: []
      };
      current_taxon_node.children.push(current_gene_node);

      var go_node = {
        about: assoc.object,
      }
      current_gene_node.children.push(go_node);

      prev_gene = assoc.subject.id;

    } else {
      var go_node = {
        about: assoc.object,
      }
      current_gene_node.children.push(go_node);
    }
  });
  return assocTree;
}

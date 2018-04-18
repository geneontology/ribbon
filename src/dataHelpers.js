import taxa from './data/taxa';

const queryRGB = [0, 96, 96];
const orthoRGB = [86, 148, 27];
const queryColor = "#dfebeb"; //"#c0d8d8";
const orthoColor = "#f3f9f0"; //"#d8eecd";

export function unpackSlimItems(results, subject, slimlist) {
    let title = subject;
    let queryResponse = [];
    let others = [];
    let allGOids = [];
    // console.log('results');
    // console.log(results);
    results.forEach(function (result) {
        // console.log('result');
        // console.log(result);
        if (result.data.length > 0) {
            // merge these assocs into the overall response to this query
            Array.prototype.push.apply(queryResponse, result.data);
        }
    });
    /*
    bulk of the annotations initialized first
    */
    const blocks = slimlist.map(function (slimitem) {
        if (slimitem.golabel.includes('other')) {
            others.push(slimitem);
        }
        let assocs = [];
        // console.log(queryResponse)
        queryResponse.forEach(function (response) {
            if (response.slim === slimitem.goid) {
                // skip noninformative annotations like protein binding
                // console.log(response)
                for (let i = response.assocs.length - 1; i >= 0; i--) {
                    let assoc = response.assocs[i];
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
                    assocs.forEach(function (assoc) {
                        allGOids.push(assoc.object.id);
                    })
                }
            }
        });
        // set up uniques and color too
        let block_color = orthoRGB;
        slimitem.uniqueAssocs = [];
        if (assocs.length > 0) {
            let hits = [];
            slimitem.uniqueAssocs = assocs.filter(function (assocItem, index) {
                /*
                  First a hack to accomodate swapping out HGNC ids for UniProtKB ids
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
                    title = assocItem.subject.label + ' (' +
                        assocItem.subject.id + ')';
                    block_color = queryRGB;
                }

                let label = assocItem.subject.id + ': ' +
                    assocItem.object.label + ' ' + assocItem.negated;
                // console.log('label is ' + label);
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
    others.forEach(function (otherItem) {
        for (let i = otherItem.uniqueAssocs.length - 1; i >= 0; i--) {
            let checkAssoc = otherItem.uniqueAssocs[i];
            if (allGOids.indexOf(checkAssoc.object.id) >= 0) {
                otherItem.uniqueAssocs.splice(i, 1);
            }
        }
        /*
          Need to update the color
        */
        if (otherItem.uniqueAssocs.length > 0) {
            let block_color = orthoRGB;
            let taxon_color = orthoColor;
            otherItem.uniqueAssocs.forEach(function (otherAssoc) {
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
    console.log('non-unique list');
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
    return (!references || references.contains( (r) => { r.startsWith('PMID:') })  );
}

/**
 *
 * @param references
 * @returns {*}
 */
function filterDuplicationReferences(references) {


    // if references contains a PMID, remove the non-PMID ones

    if(!containsPMID(references)){
        return references ;
    }
    else{
        return references.filter( (it) => {
            it.startsWith('PMID:')
        });
    }

}

export function buildAssocTree(assocs, subject) {
    let prev_species = '';
    let prev_gene = '';
    let current_taxon_node;
    let current_gene_node;
    let assocTree = [];

    assocs.forEach(function (assoc) {
        let taxon_color = assoc.subject.id === subject ?
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


            let go_node = {
                about: assoc.object,
                negated: assoc.negated,
                evidence: {
                    id: assoc.evidence,
                    type: assoc.evidence_type,
                    label: assoc.evidence_label,
                    with: assoc.evidence_with,
                },
                publications: assoc.publications,
                reference: filterDuplicationReferences(assoc.reference),
            };

            current_gene_node.children.push(go_node);

            prev_species = assoc.subject.taxon.id;
            prev_gene = assoc.subject.id;

        } else if (assoc.subject.id !== prev_gene) {

            // TODO: should we remove this because we are no longer handling orthology?


            current_gene_node = {
                about: assoc.subject,
                children: []
            };
            current_taxon_node.children.push(current_gene_node);


            let go_node = {
                about: assoc.object,
                negated: assoc.negated,
                evidence: {
                    id: assoc.evidence,
                    type: assoc.evidence_type,
                    label: assoc.evidence_label,
                    with: assoc.evidence_with,
                },
                publications: assoc.publications,
                reference: assoc.reference,
            };

            current_gene_node.children.push(go_node);

            prev_gene = assoc.subject.id;

        } else {
            let go_node = {
                about: assoc.object,
                negated: assoc.negated,
                evidence: {
                    id: assoc.evidence,
                    type: assoc.evidence_type,
                    label: assoc.evidence_label,
                    with: assoc.evidence_with,
                },
                publications: assoc.publications,
                reference: assoc.reference,
            };

            current_gene_node.children.push(go_node);
        }
    });
    return assocTree;
}

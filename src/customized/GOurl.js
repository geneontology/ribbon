'use strict';

const geneProductLink = 'http://amigo.geneontology.org/amigo/gene_product/';
const geneSearchLink = 'http://amigo.geneontology.org/amigo/search/annotation?q=*:*';
//const phenoLink = 'https://monarchinitiative.org/gene/*#phenotypes';

export default function getGOLinkTarget(subject_id, protein_id, block) {
  let link_id = (protein_id === undefined) ? subject_id : protein_id;
  let link = geneProductLink + link_id;
  if(!block || block.class_id.indexOf('All')===0){
    return link ;
  }
  if (block.class_id.indexOf('aspect') < 0) {
    link = geneSearchLink + '&fq=bioentity:"'+link_id+'"';
    link += '&fq=regulates_closure:"'+block.class_id+'"';
    link += '&sfq=document_category:"annotation"';
    return link ;
  } else {
    let twostrings = block.class_id.split(' ');
    let closureId = twostrings[0];
    link = geneSearchLink + '&fq=bioentity:"'+link_id+'"';
    link += '&fq=regulates_closure:"'+closureId+'"';
    link += '&sfq=document_category:"annotation"';
    return link ;
  }
}

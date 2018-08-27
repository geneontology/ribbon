'use strict';

//const geneSearchLink = 'http://monarchinitiative.org/gene/search/annotation?q=*:*';
const geneProductLink = 'https://monarchinitiative.org/gene/';

export default function getPhenoLinkTarget(subject_id) {
  let link = geneProductLink + subject_id + '#phenotypes';
  return link;
  /*
  if(!block || block.class_id.indexOf('All')===0){
    return link ;
  }
  if (block.class_id.toLowerCase().indexOf('aspect') < 0) {
    link = geneSearchLink + '&fq=bioentity:"'+subject_id+'"';
    link += '&fq=regulates_closure:"'+block.class_id+'"';
    link += '&sfq=document_category:"annotation"';
    return link ;
  } else {
    let twostrings = block.class_id.split(' ');
    let closureId = twostrings[0];
    link = geneSearchLink + '&fq=bioentity:"'+subject_id+'"';
    link += '&fq=regulates_closure:"'+closureId+'"';
    link += '&sfq=document_category:"annotation"';
    return link ;
  }
  */
}

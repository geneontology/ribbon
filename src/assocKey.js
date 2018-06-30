
/*
  Have to deal with GO and Monarch differences in the JSON to display either function or phenotypes
  GO uses evidence_type (3 letter code) and Monarch evidence_label.
*/
export default function getKey(assoc) {
  let qualifier = (assoc.qualifier && assoc.qualifier.length > 1) ? assoc.qualifier[0] : undefined;
  return (qualifier !== undefined ?
    qualifier + '::' + assoc.subject.id + '-' + assoc.object.id :
    assoc.subject.id + '-' + assoc.object.id);
}

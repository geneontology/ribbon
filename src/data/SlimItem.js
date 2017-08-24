import Immutable from 'immutable';

const SlimItem = Immutable.Record({
  goid: '',
  golabel: '',
  color: '',
  separator: false,
  uniqueAssocs: [],
  visible: false,
});

export default SlimItem;

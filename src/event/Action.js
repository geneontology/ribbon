import ActionType from './ActionType';
import BlockDispatcher from './BlockDispatcher';

const Action = {
  toggle(slimitem) {
    return (BlockDispatcher.dispatch({
      type: ActionType.TOGGLE,
      value: slimitem
    }));
  }
}

export default Action;

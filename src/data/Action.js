import ActionType from './ActionType';
import RibbonDispatcher from './RibbonDispatcher';

const Action = {
  fetch(subject, mode) {
    return (RibbonDispatcher.dispatch({
      type: ActionType.FETCH,
      value: {mode: mode, subject: subject}
    }));
  }
}

export default Action;

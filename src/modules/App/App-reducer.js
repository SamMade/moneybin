import moment from 'moment';

export function appReducer(state, action) {
  switch (action.type) {
    case 'add-announcement': 
      return {
        ...state,
        announcement: [].concat(state.announcement, [action]),
      };
    case 'change-node': 
      return {
        ...state,
        node: action.node,
      };
    case 'server-event':
      return {
        ...state,
        refreshTrigger: state.refreshTrigger + 1,
      }
    case 'change-timeframe': 
      return {
        ...state,
        timeframe: {
          start: action.start,
          end: action.end,
          type: action.text, 
        },
      };
    default:
      throw new Error();
  }
}

export const appReducerInit = {
  announcement: [],
  node: null,
  refreshTrigger: 0,
  timeframe: {
    start: moment().startOf('month').valueOf(),
    end: moment().endOf('month').valueOf(),
    type: 'month',
  }
};

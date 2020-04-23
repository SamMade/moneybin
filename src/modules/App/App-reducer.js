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
    case 'change-timeframe': 
      return {
        ...state,
        timeframe: {
          start: action.start,
          end: action.end,
          type: action.type, 
        },
      };
    default:
      throw new Error();
  }
}

export const appReducerInit = {
  announcement: [],
  node: null,
  timeframe: {
    start: moment().startOf('month').valueOf(),
    end: moment().endOf('month').valueOf(),
    type: 'month',
  }
};

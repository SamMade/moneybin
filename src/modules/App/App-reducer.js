export function appReducer(state, action) {
  switch (action.type) {
    case 'add-announcment': 
      return {
        ...state,
        announcement: [].concat(state.announcement, [action])
      }
    default:
      throw new Error();
  }
}

export const appReducerInit = {
  announcement: [],
};

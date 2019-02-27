export const CLEAR_WINDOW = 'POPUP_CLOSE_WINDOW';

export function clearWindow(dispatch) {
  return () => dispatch({type: CLEAR_WINDOW});
}

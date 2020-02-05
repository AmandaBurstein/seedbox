import { createStore } from "redux";

let initialState = {
  loggedIn: false,
  securityKey: ""
};

let reducer = (state, action) => {
  if (action.type === "login-success") {
    return { ...state, loggedIn: true };
  }

  if (action.type === "security-key") {
    return { ...state, securityKey: action.value };
  }

  return state;
};

const store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;

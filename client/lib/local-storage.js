import {List, Map, Set, fromJS} from 'immutable';

export const loadState = (key, defaultState) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return defaultState;
    }
    let state = fromJS(JSON.parse(serializedState));

    return state
  } catch(err) {
    return defaultState;
  }
}

export const saveState = (key, state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch(err) {
    console.log('error saving state', key, state, err.message);
    return undefined;
  }
}

export const simpleStore = (key) => {
  const get = () => {
    let results = undefined

    try {
      results = JSON.parse(localStorage.getItem(key))
    } catch (err) {
      console.warn(err)
    }

    return results
  }

  const set = (data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (err) {
      console.warn(err)
    }

    return data
  }

  return { get, set }
}

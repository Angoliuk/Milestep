import {history, list} from './actionTypes'


export function setCompaniesList(newList) {
    return {
      type: list,
      payload: newList,
    }
  }
  
  export function setHistory(newHistory) {
    return {
      type: history,
      payload: newHistory,
    }
  }
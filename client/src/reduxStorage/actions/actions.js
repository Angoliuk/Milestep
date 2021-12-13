import {history, setInfoAboutUser, list, standartTasks} from './actionTypes'

export function setUser() {
  return {
    type: setInfoAboutUser,
  }
}

//WorkPage

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

export function setStandartTasks(newStandartTasks) {
  return {
    type: standartTasks,
    payload: newStandartTasks
  }
}
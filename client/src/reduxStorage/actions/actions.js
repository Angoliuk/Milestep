import {numOfDays, searchCompanyName, searchTaskName, setInfoAboutUser, list, standartTasks} from './actionTypes'

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

export function setNumOfDays(newNumOfDays) {
  return {
    type: numOfDays,
    payload: newNumOfDays,
  }
}

export function setSearchTaskName(newSearchTaskName) {
  return {
    type: searchTaskName,
    payload: newSearchTaskName,
  }
}

export function setSearchCompanyName(newSearchCompanyName) {
  return {
    type: searchCompanyName,
    payload: newSearchCompanyName,
  }
}

export function setStandartTasks(newStandartTasks) {
  return {
    type: standartTasks,
    payload: newStandartTasks
  }
}
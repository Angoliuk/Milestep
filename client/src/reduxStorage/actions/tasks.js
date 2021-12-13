import {standartTasks} from './actionTypes'


export function setStandartTasks(newStandartTasks) {
    return {
      type: standartTasks,
      payload: newStandartTasks,
    }
  }
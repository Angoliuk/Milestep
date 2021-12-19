import {companyLicenses, history, list, usersList} from './actionTypes'


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

  export function setCompanyLicenses(newCompanyLicenses) {
    return{
      type: companyLicenses,
      payload: newCompanyLicenses,
    }
  }

  export function setUsersList(newUsersList) {
    return{
      type: usersList,
      payload: newUsersList,
    }
  }

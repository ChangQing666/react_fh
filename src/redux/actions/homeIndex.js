import {
  FUZZY_SEARCH_STATIONS,
  CHANGE_SEARCH_VALUE,
  SELECT_SEARCH_RESULT,
  CHANGE_LINETOPBAR_STATUS,
  SAVE_PREVURL,
  CHANGE_TOPBARIMAGE_STATUS,
  RECEIVESTATIONINFO,
  RECEIVELINEINFO,
  CHECK_RADIUS,
  CHANGE_TONGGAO,
  CHANGE_SHAREINFO,
  CHANGE_DETAIL_SEARCH,
  RECEIVE_SEARCH_DETAIL_REFS
} from '../constants'
import config, { headers } from '../../config/'
import { Toast } from 'antd-mobile'
import cookie from 'react-cookies'

const apiPath = config.apiPath

function receiveKeyWords(val) {
  return {
    type: FUZZY_SEARCH_STATIONS,
    payload: {
      data: val
    }
  }
}

export function receiveRefs(val) {
  return {
    type: RECEIVE_SEARCH_DETAIL_REFS,
    payload: {
      data: val
    }
  }
}

export function changeDetailSearch(val) {
  return {
    type: CHANGE_DETAIL_SEARCH,
    payload: {
      data: val
    }
  }
}

export function receiveTonggao(val) {
    return {
    type: CHANGE_TONGGAO,
    payload: {
      data: val
    }
  }
}

export function receiveShareInfo(val) {
  return {
    type: CHANGE_SHAREINFO,
    payload: {
      data: val
    }
  }
}

export function fetchAboutKeyWords (searchValue,cityId='') {
  return async (dispatch, getState) => {
    try {
      const { cityDefault } = getState().lineInfo.toJS()
      if (searchValue) {
        console.log(cityDefault.id)
        const path = apiPath.SEARCHSTATIONS_NOGROUP + (cityId?cityId:cityDefault.id) + '?keyWord=' + searchValue
        const response = await fetch(path, {
          method: 'POST',
        })
        const json = await response.json()
        if (json.code === 200) {
          dispatch(receiveKeyWords(json.data))
        }
      } else {
        dispatch(receiveKeyWords([]))
      }
      // dispatch(receiveKeyWords(json.data.content))
    } catch (e) {
      console.log(e.message)
    }
  }
}


function receiveSearchValue(val) {
  return {
    type: CHANGE_SEARCH_VALUE,
    payload: {
      data: val
    }
  }
}

export function changeSearchValue (val) {
  return (dispatch, getState) => {
      val = val?getState().homeInfo.searchValue ? getState().homeInfo.searchValue:'' + val:''
    dispatch(receiveSearchValue(val))
  }
}

function receiveSearchResults(val) {
  return {
    type: SELECT_SEARCH_RESULT,
    payload: {
      data: val
    }
  }
}

export function selectSearchResults (val) {
  return dispatch => {
    dispatch(receiveSearchResults(val))
  }
}

export function changeTopBarStatus (val) {
  cookie.save('lineTopBarStatus',val)
  return {
    type: CHANGE_LINETOPBAR_STATUS,
    payload: {
      data: val
    }
  }
}
// SEARCHCITYSTATIONSINFO
function receiveStationInfo(val) {
  return {
    type: RECEIVESTATIONINFO,
    payload: {
      data: val
    }
  }
}

export function fetchCityStationsInfo (cityId) {
  return async (dispatch, getState) => {
    try {
        const {cityDefault} = getState().lineInfo.toJS()
        const path = apiPath.SEARCHSTATIONSINFOGROUP + (cityId?cityId:cityDefault.id)
        const response = await fetch(path, {
          method: 'POST',
          headers: headers(),
        })
        const json = await response.json()
        if (json.code === 200) {
          dispatch(receiveStationInfo(json.data))
        }
    } catch (e) {
      console.log(e.message)
    }
  }
}

// SEARCHCITYLINESINFO
export function receiveLineInfo(val) {
  return {
    type: RECEIVELINEINFO,
    payload: {
      data: val
    }
  }
}


export function fetchCityLinesInfo (cityId) {
  return async (dispatch, getState) => {
    try {
        const {cityDefault} = getState().lineInfo.toJS()
        const path = apiPath.SEARCHLINES + (cityId?cityId:cityDefault.id)
        const response = await fetch(path, {
          method: 'POST',
          headers: headers(),
        })
        const json = await response.json()
        if (json.code === 200) {
          dispatch(receiveLineInfo(json.data))
        } else {
          Toast.info('没有更多的数据')
        }
    } catch (e) {
      console.log(e.message)
    }
  }
}

export  function receivePrevUrl (val) {
  return {
    type: SAVE_PREVURL,
    payload: {
      data: val
    }
  }
}

export function changeTopBarImageStatus (val) {
  cookie.save("topBarImageStatus",val)
  return {
    type: CHANGE_TOPBARIMAGE_STATUS,
    payload: {
      data: val
    }
  }
}

export function receiveCheckRadius(val) {
  return {
    type: CHECK_RADIUS,
    payload: {
      data: val
    }
  }
}
import { createReducer } from 'redux-immutablejs'
import { fromJS } from 'immutable'
import cookie from 'react-cookies'
import {
  CITY_DEFAULT,
  CITY_LIST,
  SITE_DEFAULT,
  SITE_LIST,
  STATIONDETAIL,
  STATIONINDEX,
  LINE_SEARCHSTATUS,
  REMARK
} from '../constants'

export const lineInfo = createReducer(fromJS({
  cityDefault: '',
  cityList: [],
  siteDefault: '',
  siteList: [],
  stationDetail: '',
  stationIndex: [],
  searchStatus: 0,
  reMark: {
    reMarkStatus: 0,
    reMarkInfo: ''
  }
}
), {
  [CITY_DEFAULT]: (state, action) => {
    return state.merge({
      cityDefault: action.payload.data
    })
  },
  [CITY_LIST]: (state, action) => {
    return state.merge({
      cityList: action.payload.data
    })
  },
  [SITE_DEFAULT]: (state, action) => {
    return state.merge({
      siteDefault: action.payload.data
    })
  },
  [SITE_LIST]: (state, action) => {
    return state.merge({
      siteList: action.payload.data
    })
  },
  [STATIONDETAIL]: (state, action) => {
    return state.merge({
      stationDetail: action.payload.data
    })
  },
  [STATIONINDEX]: (state, action) => {
    return state.merge({
      stationIndex: action.payload.data
    })
  },
  [LINE_SEARCHSTATUS]: (state, action) => {
    return state.merge({
      searchStatus: action.payload.val
    })
  },
  [REMARK]: (state, action) => {
    return state.merge({
      reMark: action.payload
    })
  }
})

import { createReducer } from 'redux-immutablejs'
import { fromJS } from 'immutable'
import cookie from 'react-cookies'
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

export const homeInfo = createReducer(fromJS({
  fuzzy_station_list: [],
  searchValue: '',
  selectSearchResult: '',
  lineTopBarStatus: 0,
  prevUrl: '',
  topBarImageStatus: 0,
  stationInfo: [],
  lineInfo: [],
  Index_radius: -1,
  tonggaoStatus: 1,
  refsFun: null,
  shareInfo: {
      title: '坐地铁，超近道，轻松一查就知道。',
      desc: '快速换乘、快速出站、找厕所、首末班时间，一键查询。',
      link: 'https://bbh.jyall.com/#/line',
      imgUrl: 'https://bbh.jyall.com/assets/images/icon@3x.png'
    },
  detailSearch: 0,
  lineId:''
}
), {
  [FUZZY_SEARCH_STATIONS]: (state, action) => {
    return state.merge({
      fuzzy_station_list: action.payload.data
    })
  },
  [CHANGE_SEARCH_VALUE]: (state, action) => {
    return state.merge({
      searchValue: action.payload.data
    })
  },
  [SELECT_SEARCH_RESULT]: (state, action) => {
    return state.merge({
      selectSearchResult: action.payload.data
    })
  },
  [CHANGE_LINETOPBAR_STATUS]: (state, action) => {
    return state.merge({
      lineTopBarStatus: action.payload.data
    })
  },
  [SAVE_PREVURL]: (state, action) => {
    return state.merge({
      prevUrl: action.payload.data
    })
  },
  [CHANGE_TOPBARIMAGE_STATUS]: (state, action) => {
    return state.merge({
      topBarImageStatus: action.payload.data
    })
  },
  [RECEIVESTATIONINFO]: (state, action) => {
    return state.merge({
      stationInfo: action.payload.data
    })
  },
  [RECEIVELINEINFO]: (state, action) => {
    return state.merge({
      lineInfo: action.payload.data
    })
  },
  [CHECK_RADIUS]: (state, action) => {
    return state.merge({
      Index_radius: action.payload.data
    })
  },
  [CHANGE_TONGGAO]: (state, action) => {
    return state.merge({
      tonggaoStatus: action.payload.data
    })
  },
  [CHANGE_SHAREINFO]: (state, action) => {
    return state.merge({
      shareInfo: action.payload.data
    })
  },
  [CHANGE_DETAIL_SEARCH]: (state, action) => {
    return state.merge({
      detailSearch: action.payload.data
    })
  },
  [RECEIVE_SEARCH_DETAIL_REFS]: (state, action) => {
    return state.merge({
      refsFun: action.payload.data
    })
  }
})

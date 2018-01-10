import {
  CITY_DEFAULT,
  CITY_LIST,
  STATIONDETAIL,
  STATIONINDEX,
  SITE_DEFAULT,
  SITE_LIST,
  LINE_SEARCHSTATUS,
  REMARK
} from '../constants'
import config, { headers } from '../../config/'
import { Toast } from 'antd-mobile'
import cookie from 'react-cookies'
import {fetchCityLinesInfo,fetchCityStationsInfo} from './homeIndex'
const apiPath = config.apiPath

function receiveCityDefault(val){
  return {
    type: CITY_DEFAULT,
    payload: {
      data: val
    }
  }
}

export function getCityDefault(val){
  return dispatch => {
    dispatch(receiveCityDefault(val))
  }
}
export function getStationDefault (val) {
  return dispatch => {
    if (val) {
      cookie.save('siteDefault', val)
    }
    dispatch({
      type: SITE_DEFAULT,
      payload: {
        data: val
      }
    })
  }
}

function receiveCityList(val){
  return {
    type: CITY_LIST,
    payload:{
      data: val
    }
  }
}
export function fetchCityList (cityName) {
  return async (dispatch, getState) => {
    try{
      const response = await fetch(apiPath.CITYLIST, {
        method: 'POST',
        headers: headers()
      })
      const json = await response.json()
      if(json.code === 200){
        dispatch(receiveCityList(json.data))
        if(cityName){
          json.data.map((item) => {
            if(cityName === item.cityName){
              cookie.save('cityDefault', item)
              dispatch(getCityDefault(item))
              dispatch(fetchCityLinesInfo())
              dispatch(fetchCityStationsInfo())
            }
          })
        }
      }
    }catch(e){
      console.log(e.message)
    }
  }
}


function receiveLineList (val) {
  return {
    type: SITE_LIST,
    payload: {
      data: val
    }
  }
}
export function fetchLineList(item) {
  return async (dispatch, getState) => {
    try{
      const response = await fetch(apiPath.TRANSFERSTATIONLIST, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({"cityId": item?item.id:getState().lineInfo.toJS().cityDefault.id})
      })
      const json = await response.json()
      if(json.code === 200){
        if(!json.data){
          Toast.info('城市数据不存在')
        }else{
          if(item){
            dispatch(receiveCityDefault(item))
          }
          dispatch(receiveLineList(json.data))
        }
      }
    }catch(e){
      console.log(e.message)
    }
  }
}

export function receiveStationDetail (val) {
  return {
    type: STATIONDETAIL,
    payload: {
      data: val
    }
  }
}

function receiveStationIndex (val) {
  return {
    type: STATIONINDEX,
    payload: {
      data: val
    }
  }
}

export function fetchStationDetail (siteId,cityId='',fromLineId='') {
  return async (dispatch, getState) => {
    try {
        const { cityDefault,siteDefault } = getState().lineInfo.toJS()
        const path = apiPath.SEARCHSTATIONDETAIL + (cityId?cityId:cityDefault.id) + `${siteId?'/'+siteId:'/'+siteDefault}`+`${fromLineId?'?fromLineId='+fromLineId:''}`
        const response = await fetch(path, {
          method: 'POST',
          headers: headers(),
        })
        const json = await response.json()
        if (json.code === 200) {
          // if (json.data.isTransfer){
          console.log(json.data)
          let stationIndex = []
          for (let i = 0; i < json.data.data.lineInfoGroup.length; i++){
            stationIndex.push(0)
          }
          dispatch(receiveStationIndex(stationIndex))
          // }
          dispatch(receiveStationDetail(json.data))
        }
    } catch (e) {

    }
  }
}

export function fetchStationDetailMongoId (siteId,fromLineId='') {
  return async (dispatch, getState) => {
    try {
        const path = apiPath.RECEIVESTATIONDETAIL + siteId+`${fromLineId?'?fromLineId='+fromLineId:''}`
        const response = await fetch(path, {
          method: 'POST',
          headers: headers(),
        })
        const json = await response.json()
        if (json.code === 200) {
          // if (json.data.isTransfer){
          console.log(json.data)
          let stationIndex = []
          for (let i = 0; i < json.data.data.lineInfoGroup.length; i++){
            stationIndex.push(0)
          }
          dispatch(receiveStationIndex(stationIndex))
          // }
          dispatch(receiveStationDetail(json.data))
        }
    } catch (e) {

    }
  }
}

// export function fetchStationDetail (val) {
//   return async (dispatch, getState) => {
//     try {
//       const { cityDefault } = getState().lineInfo.toJS()
//       const path = apiPath.SEARCHSTATIONDETAIL + cityDefault.id + '/' + val
//       const response = await fetch(path, {
//         method: 'POST',
//         headers: headers(),
//       })
//       const json = await response.json()
//       if (json.code === 200) {
//         console.log(json.data)
//         dispatch(receiveStationDetail(json.data))
//       }
//     } catch (e) {
//       console.log(e.message)
//     }
//   }
// }

export function changeStationDetail (index) {
  return async (dispatch, getState) => {
    try{
      let { stationIndex, stationDetail } = getState().lineInfo.toJS()
      if(stationDetail.data.lineInfoGroup[index].lineInfos.length<2){
        Toast.info('暂无切换线路信息')
        return
      }
      if(stationIndex[index] === 1) {
        stationIndex[index] = 0
      }else{
        stationIndex[index] = 1
      }
      dispatch(receiveStationIndex(stationIndex))
    }catch(e){
      console.log(e.message)
    }
  }
}
export function searchStatus(val){
  return dispatch =>{
    dispatch({
      type: LINE_SEARCHSTATUS,
      payload: {
        val: val
      }
    })
  }
}
export function reMark(status, val){
  return dispatch =>{
    dispatch({
      type: REMARK,
      payload: {
        reMarkStatus: status,
        reMarkInfo: val
      }
    })
  }
}

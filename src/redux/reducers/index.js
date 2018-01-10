import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { lineInfo } from './line'
import { homeInfo } from './homeIndex'

const rootReducer = combineReducers({
  homeInfo,
  lineInfo,
  routing: routerReducer
})

export default rootReducer

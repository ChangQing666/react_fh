import apiPath from './apiPath'
import { hashHistory, browserHistory } from 'react-router'

let config = {
  apiPath: apiPath,
  history: browserHistory
}
export * from './headers'
export default config

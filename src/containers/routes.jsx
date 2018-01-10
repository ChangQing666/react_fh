import LineTop from './lineTop'
import HomeIndex from './homeIndex'
import SearchPage from './searchPage'
import HomeApp from './homeApp'
import { Tool } from '../utils/'

const routes = {
  childRoutes: [{
    path: '/',
    component: HomeIndex,
    onEvent: Tool.getWxCode()
  },{
    path: 'searchPage',
    component: SearchPage,
    onEvent: Tool.getWxCode()
  },
  {
    path: 'line(/:name)',
    onEvent: Tool.getWxCode(),
    component: HomeApp,
    indexRoute: {
      getComponent (nextState, callback) {
        require.ensure([], require => {
          callback(null, require('./homePage').default)
        }, 'homePage')
      }
    }
  },
  {
    path: 'hourses',
    component: LineTop,
    onEvent: Tool.getWxCode(),
    childRoutes: [
      {
        path: 'cities',
        getComponent (nextState, callback) {
          require.ensure([], require => {
            callback(null, require('./cityGird').default)
          }, 'cityGird')
        }
      },{
      path: 'lineIndex',
      getComponent (nextState, callback) {
        require.ensure([], require => {
          callback(null, require('./lineIndex').default)
        }, 'lineIndex')
      },
      indexRoute: {
        getComponent (nextState, callback) {
          require.ensure([], require => {
            callback(null, require('./followStations').default)
          }, 'followStations')
        }
      },
      childRoutes: [{
        path: 'followLines(/:name)',
        getComponent (nextState, callback) {
          require.ensure([], require => {
            callback(null, require('./followLines').default)
          }, 'followLines')
        }
      },{
        path: 'followStations(/:name)',
        getComponent (nextState, callback) {
          require.ensure([], require => {
            callback(null, require('./followStations').default)
          }, 'followStations')
        }
      }]
    },
      {
      path: 'detail(/:name)',
      getComponent (nextState, callback) {
        require.ensure([], require => {
          callback(null, require('./stationDetail').default)
        }, 'stationDetail')
      }
    }
    ]
  }]
}

export default routes

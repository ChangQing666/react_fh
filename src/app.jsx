import "whatwg-fetch"
import 'Styles/common'
import React from 'react'
import {render} from 'react-dom'
import {Router, match } from 'react-router'
import {Provider} from 'react-redux'
import routes from './containers/routes'
import configureStore from './redux/configureStore'
import config from './config/'
/*import vConsole from 'vconsole'
new vConsole()*/

const store = configureStore(window.REDUX_STATE)
const app = document.createElement('div')
document.body.appendChild(app)

match({history: config.history, routes}, (error, redirectLocation, renderProps) => {
    render(
        <Provider store={store}>
            <Router {...renderProps}/>
        </Provider>,
        app
    )
})

import 'babel-polyfill'

import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { createBrowserHistory } from 'history'
import { routerMiddleware, connectRouter, ConnectedRouter } from 'connected-react-router/immutable'
import { Provider } from 'react-redux'
import { Map } from 'immutable'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/Layout/App'
import rootReducer from './redux/index'
import { loadState, saveState } from './lib/local-storage'
import ReactHighcharts from 'react-highcharts'
import OfflineExporting from 'highcharts/modules/offline-exporting'
import Exporting from 'highcharts/modules/exporting'


import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.scss'
import API from './lib/api-store';

Exporting(ReactHighcharts.Highcharts)
OfflineExporting(ReactHighcharts.Highcharts)

const localStorageKey = 'welcomeToTheMachine'
const persistedState = loadState(localStorageKey, Map())
// const persistedState = Map()

const history = createBrowserHistory()
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  connectRouter(history)(rootReducer),
  persistedState,
  composeEnhancer(
    applyMiddleware( 
      thunk,
      routerMiddleware(history)
    ),
  ),
)

const state = store.getState().toJS()

fetch('/version')
.then(r => r.json())
.then((data) => {
  const { app } = state
  console.group(data.name, 'deployment')
  // store.dispatch({ type: 'CLEAR_STATE' })
  // store.dispatch({ type: 'SET_VERSION', value: data })
  if ((!app.version || app.version) && (app.version !== data.version)) {
    if (app.version) {
      console.warn('existing version', app.version, 'out of date... clearing session.')
    }
    localStorage.clear()
    store.dispatch({ type: 'CLEAR_STATE' })
    store.dispatch({ type: 'SET_VERSION', value: data })
  }
  console.info('version', data.version)
  console.info('deployed on', new Date(data.deployed))
  console.groupEnd()
})

// On dispatch of events, stamp full state into localStorage
store.subscribe(() => {
  saveState(localStorageKey, store.getState())
})

ReactHighcharts.Highcharts.setOptions({
    exporting: {
      fallbackToExportServer: false,
    },
    navigation: {
      buttonOptions: {
        enabled: false,
      },
    },
    colors: [
      '#56B3D8',
      '#C3E4CC',
      '#E4CE5E',
      '#C26A1B',
      '#5D2311',
      '#141551',
      '#355695',
      '#90D2CE',
      '#F4F296',
    ],
    // lang: {
    //     loading: 'Cargando...',
    //     months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    //     weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    //     shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    //     exportButtonTitle: "Exportar",
    //     printButtonTitle: "Importar",
    //     rangeSelectorFrom: "Desde",
    //     rangeSelectorTo: "Hasta",
    //     rangeSelectorZoom: "Período",
    //     downloadPNG: 'Descargar imagen PNG',
    //     downloadJPEG: 'Descargar imagen JPEG',
    //     downloadPDF: 'Descargar imagen PDF',
    //     downloadSVG: 'Descargar imagen SVG',
    //     printChart: 'Imprimir',
    //     resetZoom: 'Reiniciar zoom',
    //     resetZoomTitle: 'Reiniciar zoom',
    //     thousandsSep: ",",
    //     decimalPoint: '.'
    // }
});



const bootstrap = () => {
  document.getElementById('app').classList.remove('isLoading', 'isRestoring')
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>,
    document.getElementById('app'),
  )
}

if (state.user) {
  document.getElementById('app').className = 'isLoading isRestoring'
  const later = new Date()
  later.setTime(later.getTime() + 846000)
  API.auth(state.user)
    .then((user) => {
      if (!user) {
        console.log('what happened here?')
        store.dispatch({ type: 'LOGOUT' })
      } else {
        console.info(`user "${user.id}" authenticated from previous session`)
        store.dispatch({ type: 'LOGIN', value: user })
        store.dispatch({ type: 'REFRESH', time: later })
      }
      bootstrap()
    })
  console.log('something here')
} else {
  console.log('no user found in state...')
  bootstrap()
}

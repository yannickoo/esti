import riot from 'riot'
import mixin from 'riot-redux-mixin'

import './tags'
import configureStore from './store'

const username = window.localStorage.getItem('username')

// We need `undefined` to make redux reducers'
// default value work as expected
let name
if (username) {
  name = username
}

const initialState = {
  user: {
    name
  }
}

let store = configureStore(initialState)

riot.mixin('redux', mixin(store))
riot.mount('esti')
riot.route.base('/')

document.addEventListener('DOMContentLoaded', () => {
  riot.route.start(true)
})

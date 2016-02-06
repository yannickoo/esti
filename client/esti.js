import riot from 'riot'
import mixin from 'riot-redux-mixin'

import './tags'
import configureStore from './store'

let store = configureStore()

riot.mixin('redux', mixin(store))
riot.mount('esti')
riot.route.base('/')
riot.route.start(true)

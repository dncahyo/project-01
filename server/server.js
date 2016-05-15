import path from 'path'
import Express from 'express'
import qs from 'qs'

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
// import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.config'

import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'

import Exphbs from 'express-handlebars'

import configureStore from '../shared/store/configureStore'
import App from '../shared/containers/App'
import { fetchCounter } from '../shared/api/counter'

const app = new Express()
const port = 3000

// Use this middleware to set up hot module reloading via webpack.
const compiler = webpack(webpackConfig)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }))
// app.use(webpackHotMiddleware(compiler))

// set up HandleBars
app.set('views', path.join(__dirname, '/../client/html'))
app.engine('.hbs', Exphbs({defaultLayout: 'index', extname: '.hbs', layoutsDir: path.join(__dirname, '/../client/html')}))
app.set('view engine', '.hbs')

// This is fired every time the server side receives a request
app.use(handleRender)

function handleRender (req, res) {
  // Query our mock API asynchronously
  fetchCounter(apiResult => {
    // Read the counter from the request, if provided
    const params = qs.parse(req.query)
    const counter = parseInt(params.counter, 10) || apiResult || 0

    // Compile an initial state
    const initialState = { counter }

    // Create a new Redux store instance
    const store = configureStore(initialState)

    // Render the component to a string
    const html = renderToString(
      <Provider store={store}>
        <App />
      </Provider>
    )

    // Grab the initial state from our Redux store
    const finalState = store.getState()

    // Send the rendered page back to the client
    res.render('index', { html: html, initialState: JSON.stringify(finalState) })
  })
}

app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
})

import express from 'express'
import cors from 'cors'

const app = express()
// LISA in T9 dialing
const port = 5472

// Remove any trailing slashes with redirect
// https://stackoverflow.com/a/15773824
app.use((req, res, next) => {
  if (req.path.slice(-1) === '/' && req.path.length > 1) {
    const query = req.url.slice(req.path.length)
    const safepath = req.path.slice(0, -1).replace(/\/+/g, '/')
    res.redirect(301, safepath + query)
  } else {
    next()
  }
})

// Static Web Files
app.use(express.static('public'))
// Flatten icons to /public for device support reasons
app.use(express.static('public/icons'))

// JSON support
app.use(express.json())

// Allowed hosts
let corsOptions = {
   origin : ['https://frontend-project3.apps.rosa.rosa-t8j8w.ft2c.p3.openshiftapps.com'],
}

// Allow hosts
app.use(cors(corsOptions))

// Global info
app.locals.systemPromptSetting = 'default'

// Add endpoints
import { router as apiRouter } from './routes/api.js'
app.use('/api/v1', apiRouter)

// Host express server
app.listen(port, () => {
  console.info('Express server listening on http://127.0.0.1:' + port)
})

app.locals.userMessages = []
app.locals.lisaMessages = []

export { app }

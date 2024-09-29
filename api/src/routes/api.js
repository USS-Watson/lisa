import { Router } from 'express'

import { app } from '../index.js'
import { textToSpeech } from '../lib/tts.js'
import { getLlmResponse } from '../lib/llm.js'

import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = Router()

router.post('/prompt', async (req, res) => {
  const data = req.body
  if (data.prompt) {
    const text = await getLlmResponse(data.prompt)
    await textToSpeech(text)
    res.sendFile(resolve(__dirname + '/../../prompt.mp3'))
  } else {
    res.sendStatus(418)
  }
})

router.post('/settings', (req, res) => {
  const data = req.body
  if (data.systemPromptSetting) {
    app.locals.systemPromptSetting = data.systemPromptSetting
    res.sendStatus(200)
  } else {
    res.sendStatus(418)
  }
})

export { router }

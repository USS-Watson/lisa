import { Router } from 'express'

import { app } from '../index.js'
import { textToSpeech } from '../lib/tts.js'
import { getLlmResponse } from '../lib/llm.js'

import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

import { KJUR } from 'jsrsasign'

import { upload } from '../lib/uploads.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = Router()

const coerceRequestBody = (body) => ({
  ...body,
  ...['role', 'expirationSeconds', 'cloudRecordingOption', 'cloudRecordingElection', 'audioCompatibleMode'].reduce(
    (acc, cur) => ({ ...acc, [cur]: typeof body[cur] === 'string' ? parseInt(body[cur]) : body[cur] }),
    {}
  )
})

const joinGeoRegions = (geoRegions) => toStringArray(geoRegions)?.join(',')

router.post('/jwt', (req, res) => {
  const requestBody = coerceRequestBody(req.body)

  const {
    role,
    sessionName,
    expirationSeconds,
    userIdentity,
    sessionKey,
    geoRegions,
    cloudRecordingOption,
    cloudRecordingElection,
    audioCompatibleMode
  } = requestBody

  const iat = Math.floor(Date.now() / 1000)
  const exp = expirationSeconds ? iat + expirationSeconds : iat + 60 * 60 * 2
  const oHeader = { alg: 'HS256', typ: 'JWT' }

  const oPayload = {
    app_key: process.env.ZOOM_SDK_KEY,
    role_type: role,
    tpc: sessionName,
    version: 1,
    iat,
    exp,
    user_identity: userIdentity,
    session_key: sessionKey,
    geo_regions: joinGeoRegions(geoRegions),
    cloud_recording_option: cloudRecordingOption,
    cloud_recording_election: cloudRecordingElection,
    audio_compatible_mode: audioCompatibleMode
  }

  const sHeader = JSON.stringify(oHeader)
  const sPayload = JSON.stringify(oPayload)
  const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, process.env.ZOOM_SDK_SECRET)
  return res.json({ signature: sdkJWT })
})

router.post('/prompt', async (req, res) => {
  const data = req.body
  if (data.prompt) {
    const text = await getLlmResponse(data.prompt)
    // res.send(text)
    await textToSpeech(text)
    res.sendFile(resolve(__dirname + '/../../prompt.mp3'))
  } else {
    res.sendStatus(418)
  }
})

router.post('/clear', async (req, res) => {
  app.locals.userMessages = []
  app.locals.lisaMessages = []
  res.sendStatus(200)
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

router.post("/documentUpload", upload.single("file"), (req, res) => {
  return res.json({ message: req.file.location });
});

export const toStringArray = (value) =>
  Array.isArray(value)
    ? value.flatMap(replaceWhitespace).filter(isDefined)
    : value?.split(',').map(replaceWhitespace).filter(isDefined)

export { router }

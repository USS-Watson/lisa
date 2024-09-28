import elevenLabs from 'elevenlabs-js'
import 'fs'
import 'dotenv/config'

async function textToSpeech(text) {
  elevenLabs.setApiKey(process.env.ELEVENLABS_API_KEY)

  await elevenLabs
    .textToSpeech('OYTbf65OHHFELVut7v2H', text, 'eleven_turbo_v2', {
      stability: 0.5,
      similarity_boost: 0.75,
    })
    .then(async (res) => {
      await res.saveFile('prompt.mp3')
    })
}

export { textToSpeech }

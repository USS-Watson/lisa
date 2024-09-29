import 'dotenv/config'
import FormData from 'form-data'
import axios from 'axios'
import fs from 'fs'

async function getSttResponse(filename) {
  const form = new FormData()
  form.append('file', fs.createReadStream(filename))

  const response = await axios.post(process.env.STT_ENDPOINT, form, {
    headers: {
      ...form.getHeaders(),
    },
  })
  const responseText = response.data.text
  console.log('stt', responseText)
  return responseText
}

export { getSttResponse }

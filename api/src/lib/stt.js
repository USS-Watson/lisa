import 'dotenv/config'

async function getSttResponse(file) {
  const response = await fetch(process.env.STT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'audio/wav',
    },
    body: file,
  })
  const responseText = await response.text()
  console.log(responseText)
  return responseText
}

export { getSttResponse }

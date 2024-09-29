import 'dotenv/config'

async function getLlmResponse(text) {
  const response = await fetch(process.env.LLM_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: text,
    }),
  })
  // console.log(response)
  const responseText = await response.text()
  return responseText
}

export { getLlmResponse }

import 'dotenv/config'
import { app } from '../index.js'

const SYSTEM_PROMPT_START = `### TASK: Complete the following conversation with a single response from the advisor, in ONE (1) SINGLE COMPLETE SENTENCE. Only provide ONE RESPONSE in ONE SENTENCE to replace the string <your response>. DO NOT NUMBER YOUR RESPONSE. Be polite. If they ask to register for a class, say YES. DO NOT REPEAT RESPONSES.


USER: I need some help registering for my classes today. Can you help with that?
ADVISOR: I can certainly help with that. Did you have any specific questions I can answer?
USER: `

const SYSTEM_PROMPT_END = `
ADVISOR: <your response>

===========

### response: `

const ERROR_MESSAGE = "Sorry, I can't help with that. Can you ask again?"

async function getLlmResponse(text) {
  if (text.length == 0) return ERROR_MESSAGE
  let conversationHistory = ''
  if (app.locals.userMessages.length != app.locals.assistantMessages.length) {
    console.log('this should never happen')
    return ERROR_MESSAGE
  }
  for (let i = 0; i < app.locals.userMessages.length; i++) {
    conversationHistory += app.locals.userMessages[i] + '\nASSISTANT: '
    conversationHistory += app.locals.assistantMessages[i] + '\nUSER: '
  }
  const prompt = SYSTEM_PROMPT_START + conversationHistory + text.trim() + SYSTEM_PROMPT_END
  const response = await fetch(process.env.LLM_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
    }),
  })
  let responseText
  try {
    responseText = (await response.text()).split('### response:')[1].trim()
    responseText = responseText.replace('\\n', ' ')
    if (responseText.startsWith('ADVISOR:')) {
      responseText = responseText.split('ADVISOR:')[1].trim()
    }
    ['USER:', ' 4. ', '###'].forEach((string) => {
      responseText = responseText.split(string)[0].trim()
    })
    if (responseText.endsWith('"]')) {
      responseText = responseText.slice(0, -2)
    }
    responseText = responseText.replace('1. ', '').replace('2. ', '. ').replace('3. ', '. ').replace('. . ', '. ')
  } catch (e) {
    console.log(e)
    return ERROR_MESSAGE
  }

  app.locals.userMessages.push(text)
  app.locals.assistantMessages.push(responseText)
  console.log(app.locals.userMessages)
  console.log(app.locals.assistantMessages)
  return responseText.trim()
}

export { getLlmResponse }

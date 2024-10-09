import 'dotenv/config'
import { app } from '../index.js'

const SYSTEM_PROMPT_START = `### CONTEXT: the user is a Computer Science major. These are some example Computer Science courses:

FIRST YEAR:
CSCE 155A - Computer Science I
MATH 106 - Calculus I (ACE 3)
CSCE 155H - Honors: Computer Science I
CSCE 155E - Computer Science I: Systems Engineering Focus
CSCE 155T - Computer Science I: Informatics Focus
MATH 107 - Calculus II
CSCE 156 - Computer Science II

SECOND YEAR:
MATH 314 - Linear Algebra
CSCE 231 - Computer Systems Engineering
CSCE 235 - Introduction to Discrete Structures
or CSCE 235H - Honors: Introduction to Discrete Structures
CSCE 251 - Unix Programming Environment
STAT 380 - Statistics and Applications
CSCE 310 - Data Structures and Algorithms
or CSCE 310H - Honors: Data Structures and Algorithms
CSCE 361 - Software Engineering
or CSCE 361H - Software Engineering

THIRD and FOURTH YEAR:
300- and 400-level CSCE courses of your choosing


### YOUR TASK - The college advisor's name is LISA, which stands for Local Intelligent School Advisor. Complete the following conversation with a single response from LISA. Only provide ONE RESPONSE to replace the string <your response>. DO NOT NUMBER YOUR RESPONSE. Be polite. If the user asks to register for a class, say YES. DO NOT REPEAT RESPONSES.
Any time you name a course, say its full ID including the CSCE part, not just the number.

===========

USER: I need some help registering for my classes today. Can you help with that?
LISA: I can certainly help with that. For example, you may want to register for CSCE 155A. Did you have any specific questions I can answer?
USER: `

const SYSTEM_PROMPT_END = `
LISA: <your response>

===========

### response: `

const ERROR_MESSAGE = "Sorry, I can't help with that. Can you ask again?"

async function getLlmResponse(text) {
  if (text.length == 0) return ERROR_MESSAGE
  let conversationHistory = ''
  if (app.locals.userMessages.length != app.locals.lisaMessages.length) {
    console.log('this should never happen')
    return ERROR_MESSAGE
  }
  for (let i = 0; i < app.locals.userMessages.length; i++) {
    conversationHistory += app.locals.userMessages[i] + '\nLISA: '
    conversationHistory += app.locals.lisaMessages[i] + '\nUSER: '
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
    console.log('ORIGINAL:', responseText)
    responseText = responseText.replace('\\n', ' ')
    if (responseText.startsWith('LISA:')) {
      responseText = responseText.split('LISA:')[1].trim()
    }
    ['USER:', '4. ', '###'].forEach((string) => {
      responseText = responseText.split(string)[0].trim()
    })
    if (responseText.endsWith('"]')) {
      responseText = responseText.slice(0, -2)
    }
    responseText = responseText.replace('1. ', '').replace('2. ', '. ').replace('3. ', '. ').replace('. . ', '. ').replace('LISA:', '')
  } catch (e) {
    console.log(e)
    return ERROR_MESSAGE
  }

  if (text.length == 0) return ERROR_MESSAGE

  app.locals.userMessages.push(text)
  app.locals.lisaMessages.push(responseText)
  console.log(app.locals.userMessages)
  console.log(app.locals.lisaMessages)
  return responseText.trim()
}

export { getLlmResponse }

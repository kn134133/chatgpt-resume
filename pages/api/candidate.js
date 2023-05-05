import path from 'path';
import { promises as fs } from 'fs';
import { Configuration, OpenAIApi } from "openai";

// chat GPT setting
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function (req, res) {

  try {
    const jobId = req.body.jobId || '';
    // Find the absolute path of the json directory
    const jsonDirectory = path.join(process.cwd(), 'db');

    // Read the json data file data.json
    let resumes = await fs.readFile(jsonDirectory + '/resumes.json', 'utf8');
    let positions = await fs.readFile(jsonDirectory + '/positions.json', 'utf8');
    positions = JSON.parse(positions);
    resumes = JSON.parse(resumes);

    const position = positions.find(positionRecord => positionRecord.id == jobId);

    //Return the content of the data file in json format
    const completion = await chatGPTQuery(position, resumes);

    const result = { result: completion.data.choices[0].text };

    if (result.result !== null && typeof result.result === 'string' && result.result !== '') {
      const data = JSON.parse(result.result);

      res.status(200).json(resumes.filter(resume => data.includes(resume.id)));
    }
    else {
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'An error occurred during your request.',
      }
    });
  }
}



async function chatGPTQuery(position, resumes) {

  return await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePrompt(position, resumes),
    temperature: 0
    // max_tokens: 60,
  });
}

function generatePrompt(position, resumes) {
  return `Given the following job description in JSON format.

Job: ${JSON.stringify(position)}

Extract a list of the ids of the ideal candidates for the position from the following resume json data:

Resume: ${JSON.stringify(resumes)}

Ouput:
`;
}
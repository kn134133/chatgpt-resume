import path from 'path';
import { promises as fs } from 'fs';

export default async function (req, res) {

  try {
    // Find the absolute path of the json directory
    const jsonDirectory = path.join(process.cwd(), 'db');
    // Read the json data file data.json
    const fileContents = await fs.readFile(jsonDirectory + '/positions.json', 'utf8');
    //Return the content of the data file in json format
    res.status(200).json(JSON.parse(fileContents));
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'An error occurred during your request.',
      }
    });
  }
}
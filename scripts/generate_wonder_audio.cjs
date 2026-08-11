require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_multilingual_v2';
const OUTPUT_DIR = path.join(__dirname, '../public/audio');

const audioList = {
  'wonder_question.mp3': "Look at these magic stones! 19 blue stones and 6 red stones. How can we add them super fast without counting one by one?",
  'wonder_subtext.mp3': "Use the 'Make a 20' Strategy! Take 1 from the 6 to make 20, leaving 5. 20 plus 5 is 25!",
};

async function generateAudio(filename, text) {
  const filePath = path.join(OUTPUT_DIR, filename);
  console.log(`[GENERATE] ${filename} -> "${text}"`);
  
  try {
    const response = await axios({
      method: 'POST',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      data: {
        text: text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error generating ${filename}:`, error.response?.data || error.message);
  }
}

async function run() {
  for (const [filename, text] of Object.entries(audioList)) {
    await generateAudio(filename, text);
    await new Promise(r => setTimeout(r, 200));
  }
  console.log('Done generating Wonder phase audio!');
}

run();

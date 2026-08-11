require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_multilingual_v2';
const OUTPUT_DIR = path.join(__dirname, '../public/audio');

const audioList = {
  'story_1.mp3': "The monkeys use Doubles! 3 bananas plus 3 bananas equals 6 bananas!",
  'story_2.mp3': "The elephants use Near Doubles! 4 apples plus 5 apples is just double 4... plus 1 extra! 8 plus 1 is 9!",
  'story_3.mp3': "The bears use Make a Ten! For 8 honey pots plus 4 honey pots, they first take 2 to make a full 10, then add the rest!",
  'story_4.mp3': "The lions use Counting On! Instead of counting all, they start at a big number like 42 and just jump 3 times!",
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
  console.log('Done generating Story phase audio!');
}

run();

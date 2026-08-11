require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_multilingual_v2';
const OUTPUT_DIR = path.join(__dirname, '../public/audio');

const audioList = {
  'story_1.mp3': "Let's learn the Doubles trick with our friend, the Monkey! When you add the exact same number twice, like 6 plus 6, you just double it! So, 6 plus 6 instantly becomes 12. Easy, right?",
  'story_2.mp3': "Next up is Near Doubles, taught by the Elephant! If you see 6 plus 7, just think of it as double 6, which is 12. Since 7 is just one more than 6, add 1 extra to your 12. 12 plus 1 is 13!",
  'story_3.mp3': "Here is the Make a Ten trick with Bhalu the Bear! To add 8 and 5, first grab 2 from the 5 to turn that 8 into a perfect 10! Now you have a full 10, and 3 left over. 10 plus 3 makes 13. You are a math master!",
  'story_4.mp3': "Finally, let's learn Counting On with the Lion! For 41 plus 3, you don't need to count all the way from one! Just start at the big number, 41, and count forward three times... 42... 43... 44!",
  'sim_m10_8.mp3': "Let's try the Make a Ten trick! We want to solve 8 plus 5. Click the loose stones to grab what you need to fill up the first frame to a perfect 10!",
  'sim_m10_7.mp3': "Let's try the Make a Ten trick! We want to solve 7 plus 5. Click the loose stones to fill up the first frame to a perfect 10!",
  'sim_m20_19.mp3': "Let's practice Make a Twenty! We need to solve 19 plus 4. We are so close to 20! Click the blocks to steal just enough to make a perfect 20 in the second frame!",
  'sim_m20_18.mp3': "Let's practice Make a Twenty! We need to solve 18 plus 6. We are so close to 20! Click the blocks to steal just enough to make a perfect 20 in the second frame!"
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
  console.log('Done generating updated audio!');
}

run();

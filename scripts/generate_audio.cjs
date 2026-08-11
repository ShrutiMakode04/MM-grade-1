require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_multilingual_v2';
const OUTPUT_DIR = path.join(__dirname, '../public/audio');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const audioList = {
  // General Feedback
  'very_good.mp3': 'Very good!',
  'not_correct.mp3': 'Not correct.',
  
  // Phases
  'intro.mp3': "Welcome to Mental Math Strategies! Join the Math Animals to learn amazing strategies.",
  'wonder.mp3': "Spot the trick! Can you add numbers quickly in your head? How do you think we can solve problems super fast?",
  'story_1.mp3': "The monkeys use Doubles! 3 bananas plus 3 bananas equals 6 bananas!",
  'story_2.mp3': "The elephants use Near Doubles! 4 apples plus 5 apples is just double 4... plus 1 extra! 8 plus 1 is 9!",
  'story_3.mp3': "The bears use Make a Ten! For 8 honey pots plus 4 honey pots, they first take 2 to make a full 10, then add the rest!",
  'story_4.mp3': "The lions use Counting On! Instead of counting all, they start at a big number like 42 and just jump 3 times!",
  
  // Simulate Phase - 8 Stations, 2 rounds each
  'sim_d_5.mp3': "Let's build double 5. Click 'Add' to drop items in both sides!",
  'sim_d_8.mp3': "Let's build double 8. Click 'Add' to drop items in both sides!",
  
  'sim_nd_5.mp3': "We have double 5. Click '+1 More' to make it Near Doubles!",
  'sim_nd_8.mp3': "We have double 8. Click '+1 More' to make it Near Doubles!",
  
  'sim_m10_8.mp3': "Solve 8 + 5. Click the loose stones to fill the 10-frame!",
  'sim_m10_7.mp3': "Solve 7 + 5. Click the loose stones to fill the 10-frame!",
  
  'sim_co_42.mp3': "Start at 42 and jump 3 times! Click Jump!",
  'sim_co_55.mp3': "Start at 55 and jump 4 times! Click Jump!",
  
  'sim_zp_17.mp3': "What happens when we add zero to 17? Click Combine!",
  'sim_zp_24.mp3': "What happens when we add zero to 24? Click Combine!",
  
  'sim_sw_3.mp3': "3 plus 8. Click Swap to see the Switcheroo trick!",
  'sim_sw_2.mp3': "2 plus 9. Click Swap to see the Switcheroo trick!",
  
  'sim_ft_6.mp3': "10 plus 6. Click Add 1s to build the number!",
  'sim_ft_8.mp3': "10 plus 8. Click Add 1s to build the number!",
  
  'sim_m20_19.mp3': "Solve 19 + 4. Click to fill the second 10-frame to make 20!",
  'sim_m20_18.mp3': "Solve 18 + 6. Click to fill the second 10-frame to make 20!",
  
  // Reflect Phase
  'reflect_great_job.mp3': "Great job! You scored",
  'reflect_out_of_30.mp3': "out of 30. You are a mental math master!",
};

// Practice Phase (30 questions)
const practiceQuestions = [
  "What is 7 + 7?",
  "Solve using make a ten: 8 + 5",
  "Near doubles: If 6 + 6 is 12, what is 6 + 7?",
  "Counting on: 42 + 3",
  "Fast tens: 10 + 9",
  "What is 8 + 8?",
  "Zero power: 25 + 0",
  "Switcheroo: 4 + 9 is the same as 9 + ?",
  "Make a twenty: 19 + 4",
  "Near doubles: 8 + 9",
  "Make a ten: 7 + 4",
  "Counting on: 55 + 4",
  "What is 5 + 5?",
  "Fast tens: 10 + 7",
  "Make a twenty: 18 + 5",
  "Zero power: 0 + 13",
  "Switcheroo: 2 + 8 is the same as 8 + ?",
  "Near doubles: 7 + 8",
  "Make a ten: 9 + 6",
  "What is 9 + 9?",
  "Counting on: 31 + 2",
  "Fast tens: 10 + 4",
  "Make a twenty: 19 + 6",
  "Near doubles: 5 + 6",
  "Make a ten: 8 + 7",
  "Zero power: 100 + 0",
  "Switcheroo: 5 + 7 is the same as 7 + ?",
  "What is 4 + 4?",
  "Counting on: 88 + 3",
  "Fast tens: 10 + 2"
];

practiceQuestions.forEach((q, i) => {
  audioList[`prac_${i}.mp3`] = q;
});

// Numbers for Reflect Phase (0 to 30)
for (let i = 0; i <= 30; i++) {
  audioList[`num_${i}.mp3`] = i.toString();
}

async function generateAudio(filename, text) {
  const filePath = path.join(OUTPUT_DIR, filename);
  if (fs.existsSync(filePath)) {
    console.log(`[SKIP] ${filename} already exists.`);
    return;
  }
  
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
  const entries = Object.entries(audioList);
  console.log(`Generating ${entries.length} audio files...`);
  for (const [filename, text] of entries) {
    await generateAudio(filename, text);
    // slight delay to avoid rate limits
    await new Promise(r => setTimeout(r, 200));
  }
  console.log('All done!');
}

run();

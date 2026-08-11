const fs = require('fs');
const path = require('path');
const https = require('https');

const apiKey = "sk_b93df5c147f0d19c2461b4833ec17e7de0de0e900df2d13a";
const voiceId = "8N2ng9i2uiUWqstgmWlH";

const prompts = {
    "welcome": "Welcome to Mental Math Strategies!",
    "wonder_intro": "The Magic Stones Mystery. Look at these magic stones! 19 blue stones and 6 red stones. How can we add them super fast without counting one by one?",
    "wonder_prompt": "Look at these magic stones! 19 blue stones and 6 red stones. How can we add them super fast without counting one by one?",
    "wonder_reveal": "Use the 'Make a 20' Strategy! Take 1 from the 6 to make 20, leaving 5. 20 plus 5 is 25!",
    "story_0": "The Bhalu is practicing for the Grand Mental Math Tournament! He has to solve addition problems super fast.",
    "story_1": "First strategy: Doubles! The Monkey uses it! When adding two of the same number, just double it! 6 plus 6 is instantly 12!",
    "story_2": "Next is Near Doubles! The Elephant knows it! For 6 + 7... double the 6 to get 12, then just add 1 more to get 13!",
    "story_3": "Now the Make a Ten trick! To add 8 and 5... take 2 from the 5 to make a perfect 10!",
    "story_4": "Now Bhalu has 10, and 3 left. 10 plus 3 equals 13! He is a Math Master!",
    "story_5": "Finally, Counting On! For 41 + 3, just start at 41 and count forward three times: 42, 43, 44!",
    "sim_prompt": "Ten Frame Simulator! Move the slider to see how Make a Ten works.",
    "world_1": "World 1: Number Basics.",
    "world_2": "World 2: Strategy Tricks.",
    "world_3": "World 3: Math Mastery.",
    "q_number_line": "Use the Jump Strategy! How much more to add the total?",
    "q_make_10": "Select the two numbers that Make a perfect 10!",
    "q_split_number": "Split the second number correctly to make a 10 first!",
    "q_domino": "Match the domino dots to solve the problem!",
    "q_balance": "Balance the equation! The left side is the same as 10 plus what?",
    "q_base10": "Count the blocks to add the numbers.",
    "correct": "Correct! Plus 3 stars!",
    "wrong": "Not quite, let's keep going!",
    "reflect_prompt": "Which Mental Math Strategy is your favorite and why?"
};

const outDir = path.join(__dirname, "src", "assets", "audio");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function generateAudio(name, text) {
    const outPath = path.join(outDir, `${name}.mp3`);
    if (fs.existsSync(outPath)) {
        console.log(`Skipping ${name}, already exists`);
        return;
    }
    
    console.log(`Generating ${name}...`);
    const data = JSON.stringify({
      text: text,
      model_id: "eleven_monolingual_v1",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 }
    });

    const options = {
        hostname: 'api.elevenlabs.io',
        path: `/v1/text-to-speech/${voiceId}`,
        method: 'POST',
        headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': apiKey,
            'Content-Length': data.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            if (res.statusCode === 200) {
                const file = fs.createWriteStream(outPath);
                res.pipe(file);
                file.on('finish', () => { file.close(); resolve(); });
            } else {
                let errData = '';
                res.on('data', chunk => errData += chunk);
                res.on('end', () => {
                    console.error(`Failed ${name}: ${errData}`);
                    resolve();
                });
            }
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function main() {
    for (const [name, text] of Object.entries(prompts)) {
        await generateAudio(name, text);
        await new Promise(r => setTimeout(r, 500));
    }
    console.log("Done generating audio files.");
}

main();

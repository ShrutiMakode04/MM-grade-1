const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const OUT_DIR = path.join(__dirname, 'src', 'assets', 'audio');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const scripts = [
    { id: "welcome", text: "Welcome to Mental Math Strategies!" },
    { id: "wonder_intro", text: "The Magic Stones Mystery. Look at these magic stones! 19 blue stones and 6 red stones. How can we add them super fast without counting one by one?" },
    { id: "wonder_prompt", text: "Look at these magic stones! 19 blue stones and 6 red stones. How can we add them super fast without counting one by one?" },
    { id: "wonder_reveal", text: "Use the 'Make a 20' Strategy! Take 1 from the 6 to make 20, leaving 5. 20 plus 5 is 25!" },
    { id: "story_0", text: "The Bhalu is practicing for the Grand Mental Math Tournament! He has to solve addition problems super fast." },
    { id: "story_1", text: "First strategy: Doubles! The Monkey uses it! When adding two of the same number, just double it! 6 plus 6 is instantly 12!" },
    { id: "story_2", text: "Next is Near Doubles! The Elephant knows it! For 6 plus 7... double the 6 to get 12, then just add 1 more to get 13!" },
    { id: "story_3", text: "Now the Make a Ten trick! To add 8 and 5... take 2 from the 5 to make a perfect 10!" },
    { id: "story_4", text: "Now Bhalu has 10, and 3 left. 10 plus 3 equals 13! He is a Math Master!" },
    { id: "story_5", text: "Finally, Counting On! For 41 plus 3, just start at 41 and count forward three times: 42, 43, 44!" },
    { id: "sim_prompt", text: "Ten Frame Simulator! Move the slider to see how Make a Ten works." },
    { id: "world_1", text: "World 1: Number Basics." },
    { id: "world_2", text: "World 2: Strategy Tricks." },
    { id: "world_3", text: "World 3: Math Mastery." },
    { id: "q_number_line", text: "Use the Jump Strategy! How much more to add the total?" },
    { id: "q_make_10", text: "Select the two numbers that Make a perfect 10!" },
    { id: "q_split_number", text: "Split the second number correctly to make a 10 first!" },
    { id: "q_domino", text: "Match the domino dots to solve the problem!" },
    { id: "q_balance", text: "Balance the equation! The left side is the same as 10 plus what?" },
    { id: "q_base10", text: "Count the blocks to add the numbers." },
    { id: "correct", text: "Correct! Plus 3 stars!" },
    { id: "wrong", text: "Not quite, let's keep going!" },
    { id: "reflect_prompt", text: "Which Mental Math Strategy is your favorite and why?" }
];

const promises = scripts.map(item => {
  return new Promise((resolve) => {
    const filename = `${item.id}.mp3`;
    const dest = path.join(OUT_DIR, filename);
    if (fs.existsSync(dest)) {
      console.log(`Skipping ${filename}`);
      resolve();
      return;
    }
    exec(`npx @hocgin/tts-cli --text "${item.text.replace(/"/g, '\\"')}" --voice en-IN-NeerjaNeural --pitch +10Hz --rate +5% --output "${dest}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error with ${filename}: ${error.message}`);
      } else {
        console.log(`Successfully saved ${filename}`);
      }
      resolve();
    });
  });
});

Promise.all(promises).then(() => console.log('All done!'));

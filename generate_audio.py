import requests
import json
import os
import time

api_key = "sk_b93df5c147f0d19c2461b4833ec17e7de0de0e900df2d13a"
voice_id = "8N2ng9i2uiUWqstgmWlH"

prompts = {
    "welcome": "Welcome to Mental Math Strategies!",
    "wonder_intro": "The Magic Stones Mystery. Look at these magic stones! 19 blue stones and 6 red stones. How can we add them super fast without counting one by one?",
    "wonder_prompt": "Look at these magic stones! 19 blue stones and 6 red stones. How can we add them super fast without counting one by one?",
    "wonder_reveal": "Use the 'Make a 20' Strategy! Take 1 from the 6 to make 20, leaving 5. 20 plus 5 is 25!",
    "story_0": "The Bhalu (Bear) is practicing for the Grand Mental Math Tournament! He has to solve addition problems super fast.",
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
}

url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

headers = {
  "Accept": "audio/mpeg",
  "Content-Type": "application/json",
  "xi-api-key": api_key
}

out_dir = "src/assets/audio"
os.makedirs(out_dir, exist_ok=True)

for name, text in prompts.items():
    out_path = os.path.join(out_dir, f"{name}.mp3")
    if os.path.exists(out_path):
        print(f"Skipping {name}, already exists")
        continue
    
    print(f"Generating {name}...")
    data = {
      "text": text,
      "model_id": "eleven_multilingual_v2",
      "voice_settings": {
        "stability": 0.5,
        "similarity_boost": 0.75
      }
    }
    
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 200:
        with open(out_path, 'wb') as f:
            f.write(response.content)
    else:
        print(f"Failed {name}: {response.text}")
    
    time.sleep(0.5)

print("Done generating audio files.")

const fs = require('fs');
const path = require('path');
const https = require('https');

const apiKey = "sk_b93df5c147f0d19c2461b4833ec17e7de0de0e900df2d13a";
const voiceId = "8N2ng9i2uiUWqstgmWlH";

async function generateAudio(name, text) {
    const outPath = path.join(__dirname, `${name}.mp3`);
    
    console.log(`Generating ${name}...`);
    const data = JSON.stringify({
      text: text,
      model_id: "eleven_multilingual_v2",
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
                file.on('finish', () => { file.close(); resolve("Success"); });
            } else {
                let errData = '';
                res.on('data', chunk => errData += chunk);
                res.on('end', () => {
                    resolve(`Failed ${name}: ${errData}`);
                });
            }
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

generateAudio("test", "Hello this is a test.").then(console.log).catch(console.error);

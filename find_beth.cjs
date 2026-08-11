const fs = require('fs');
const https = require('https');

const apiKey = "sk_b93df5c147f0d19c2461b4833ec17e7de0de0e900df2d13a";

const options = {
    hostname: 'api.elevenlabs.io',
    path: '/v1/voices',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'xi-api-key': apiKey
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        if (res.statusCode === 200) {
            const voices = JSON.parse(data).voices;
            const beth = voices.find(v => v.name.toLowerCase().includes('beth'));
            if (beth) {
                console.log(`Found Beth! Voice ID: ${beth.voice_id}`);
            } else {
                console.log("Beth not found in available voices.");
                // Print all available names to help debugging
                console.log("Available voices:", voices.map(v => v.name).join(', '));
            }
        } else {
            console.error(`Failed to fetch voices: ${res.statusCode} ${data}`);
        }
    });
});

req.on('error', console.error);
req.end();

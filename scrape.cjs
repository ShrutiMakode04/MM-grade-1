const https = require('https');

https.get('https://numberbound.vercel.app/', (res) => {
    let html = '';
    res.on('data', d => html += d);
    res.on('end', () => {
        const match = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
        if (match) {
            const jsUrl = 'https://numberbound.vercel.app' + match[1];
            https.get(jsUrl, (res2) => {
                let js = '';
                res2.on('data', d => js += d);
                res2.on('end', () => {
                    const idx = js.indexOf('function Story');
                    if (idx !== -1) {
                        console.log(js.substring(idx, idx + 3000));
                    } else {
                        console.log("Story component not found easily");
                        // try searching for Story
                        const i = js.indexOf('Story');
                        console.log(js.substring(i - 200, i + 2000));
                    }
                });
            });
        }
    });
});

const express = require('express');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Użycie Helmet do dodania zabezpieczeń, ale z odpowiednią konfiguracją dla iframe
app.use(helmet({
    frameguard: false // Wyłącz X-Frame-Options
}));

// Konfiguracja Content Security Policy (CSP), która zezwala na osadzanie strony
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: ["'self'", "data:", "http:", "https:"],
        connectSrc: ["'self'", "https://x8ki-letl-twmt.n7.xano.io"], // Zezwól na połączenia z API Xano
        frameAncestors: ["'self'", "https://aplikacjatestowa-59427.bubbleapps.io/version-test/stronadotestowania?debug_mode=true"], // Zezwolenie na osadzanie iframe na stronie Bubble
    }
}));

// Statyczne pliki i routing
app.use(express.static(path.join(__dirname, 'my-app')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'my-app', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});

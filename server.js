const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Użyj Helmet, ale dostosuj nagłówki CSP i usuń X-Frame-Options
app.use(helmet({
    frameguard: false // Wyłącz nagłówek X-Frame-Options
}));

// Konfiguracja polityki CSP
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"], // Zezwól na zasoby tylko z tej samej domeny
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Zezwól na skrypty z tej samej domeny, inline i eval
        scriptSrcAttr: ["'self'", "'unsafe-inline'"], // Zezwól na atrybuty skryptów inline
        imgSrc: ["'self'", "data:", "http:", "https:"], // Zezwól na obrazy z różnych źródeł
        connectSrc: ["'self'", "https://x8ki-letl-twmt.n7.xano.io"], // Zezwól na połączenia z API Xano
        frameAncestors: ["'self'", "https://your-bubble-domain.com"], // Zezwól na osadzanie w iframe z określonej domeny Bubble
    }
}));

// Ustawienia katalogu, w którym znajdują się pliki statyczne
app.use(express.static(path.join(__dirname, 'my-app')));

// Trasa do głównej strony
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'my-app', 'index.html'));
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});

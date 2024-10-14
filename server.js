const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Użyj Helmet, aby ustawić nagłówki bezpieczeństwa
app.use(helmet());

// Ustawienia polityki CSP
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"], // Zezwól na zasoby tylko z tej samej domeny
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Zezwól na skrypty z tej samej domeny oraz na inline (ale należy to robić ostrożnie)
        imgSrc: ["'self'", "data:", "http:", "https:"], // Zezwól na obrazy z tej samej domeny oraz z zewnętrznych
        connectSrc: ["'self'", "https://x8ki-letl-twmt.n7.xano.io"], // Zezwól na połączenia z API Xano
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
    console.log(`Serwer działa na http://localhost:${PORT}`);
});

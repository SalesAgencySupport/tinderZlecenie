const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Użyj Helmet, ale wyłącz X-Frame-Options
app.use(helmet({
    frameguard: false // Wyłączenie X-Frame-Options
}));

// Dodanie polityki CSP, aby umożliwić osadzenie w iframe
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        frameAncestors: ["'self'", "https://your-bubble-domain.com"], // Dodaj domenę Bubble, aby umożliwić osadzenie strony w iframe
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

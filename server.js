const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Użycie Helmet w celu ustawienia nagłówków bezpieczeństwa
app.use(helmet());

// Konfiguracja Content Security Policy (CSP)
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: ["'self'", "data:", "http:", "https:"],
        connectSrc: ["'self'", "https://x8ki-letl-twmt.n7.xano.io"], // Zezwól na połączenia z API Xano
        frameAncestors: ["'self'", "https://bubble.io"], // Zezwolenie na osadzanie iframe
    }
}));

// Obsługa żądań favicon
app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // Brak zawartości
});

// Ustawienia katalogu z plikami statycznymi
app.use(express.static(path.join(__dirname, 'my-app')));

// Trasa główna serwująca plik index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'my-app', 'index.html'));
});

// Obsługa błędów w ścieżce /api i inne
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Nie znaleziono API' });
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});

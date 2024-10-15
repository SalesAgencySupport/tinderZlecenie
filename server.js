const express = require('express');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Use Helmet for security but disable X-Frame-Options for iframes
app.use(helmet({
    frameguard: false
}));

// Set up CSP to allow embedding in iframes and other security settings
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: ["'self'", "data:", "http:", "https:"],
        connectSrc: ["'self'", "https://x8ki-letl-twmt.n7.xano.io"], // Allow Xano API
        frameAncestors: ["'self'", "https://aplikacjatestowa-59427.bubbleapps.io"],
    }
}));

app.use((req, res, next) => {
    res.removeHeader('X-Frame-Options');
    next();
  });
  

// Serve static files
app.use(express.static(path.join(__dirname, 'my-app')));

// Route for the main page that extracts user_id from the query string
app.get('/', (req, res) => {
    const userId = req.query.user_id || 'defaultId';  // Get user_id from the query string or use a default value
    res.sendFile(path.join(__dirname, 'my-app', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

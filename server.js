const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Simulated "database" for users (stored in a JSON file)
const USERS_FILE = './users.json';

// Load users from file or initialize with an empty array
let users = [];
if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

// Helper function to save users to file
function saveUsers() {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Routes
// Login page
app.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/index');
    } else {
        res.sendFile(__dirname + '/login.html');
    }
});

app.post('/', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.loggedIn = true;
        req.session.username = username;
        res.redirect('/index');
    } else {
        res.send("Invalid credentials. <a href='/'>Try again</a>");
    }
});

// Registration page
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Check if username already exists
    if (users.some(u => u.username === username)) {
        res.send("Username already exists. <a href='/register'>Try again</a>");
    } else {
        // Add new user to the "database"
        users.push({ username, password });
        saveUsers(); // Save users to file
        res.send("Account created successfully. <a href='/'>Login</a>");
    }
});

// Index page
app.get('/index', (req, res) => {
    if (req.session.loggedIn) {
        res.sendFile(__dirname + '/index.html');
    } else {
        res.redirect('/');
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Static files (Customer, Client, Sales pages)
app.use(express.static(__dirname));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
app.post('/', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.loggedIn = true;
        req.session.username = username;
        res.redirect('/index.html'); // Redirect to the index page after login
    } else {
        res.send("Invalid credentials. <a href='/'>Try again</a>");
    }
});

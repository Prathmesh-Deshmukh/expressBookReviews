const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js'); 
const genl_routes = require('./router/general.js');

const app = express();
const PORT = 5000;

app.use(express.json());

// Initialize session middleware
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authentication Middleware for Customer Routes
app.use("/customer/auth/*", (req, res, next) => {
    if (req.session && req.session.authorization) {
        let token = req.session.authorization["accessToken"];
        jwt.verify(token, "your_secret_key", (err, user) => {
            if (err) {
                return res.status(403).json({ message: "User not authenticated" });
            }
            req.user = user; // Store user details in request
            next();
        });
    } else {
        return res.status(401).json({ message: "Unauthorized: No session found" });
    }
});

// Use Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start Server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

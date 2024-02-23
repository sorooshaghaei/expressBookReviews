const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: false,
    saveUninitialized: false,
}));
app.use("/customer/auth*", function auth(req, res, next) {
// Check if the user is authenticated using the access token
if (req.session.accessToken) {
    // User is authenticated, proceed to the next middleware or route
    next();
  } else {
    // User is not authenticated, redirect to login or send an error response
    res.status(401).json({ error: "Unauthorized" });
  }
});
 
const PORT =6000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));

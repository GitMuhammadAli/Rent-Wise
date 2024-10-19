require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/users/userRoutes");
const home = require("./routes/home");
const connectDB = require("./config/db");
const cors = require("cors");
const { corsOptions } = require("./utils/cors");
const { initializeAdmin } = require("./controller/userController");
const listingRoutes = require("./routes/listings/listingRoutes");
const logger = require("./utils/logger");
const path = require('path');


connectDB();

require("./utils/third_party_Login");



const app = express();

// Changing port Should also Change in client\src\utils\api.js  
// Changing port Should also Change in Third-Party-logins 
const port = 3600;

app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use(express.static("public"));


// Admin INITIALIZE

initializeAdmin();



app.use(
  session({
    secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    // secure: process.env.NODE_ENV === 'production', 
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// logger
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} ${req.hostname}`);
  next();
})
// Routes
app.use("/", home);
app.use("/auth", userRoutes);
app.use("/listings", listingRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

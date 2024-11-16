
require("dotenv").config();
const helmet = require('helmet');
const {limiter} = require("./utils/Limitar");
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/users/userRoutes");
const home = require("./routes/users/home");
const connectDB = require("./config/db");
const cors = require("cors");
const { corsOptions } = require("./utils/cors");
const { initializeAdmin } = require("./controller/user/userController");
const listingRoutes = require("./routes/listings/listingRoutes");
const dashboardRoutes = require("./routes/dashboard/dashboardRoute");
const commentRoutes = require("./routes/comment/commentRoutes");
const logger = require("./utils/logger");
const path = require('path');
const errorHandler = require("./middleware/errorHandler");


connectDB();

require("./utils/third_party_Login");



const app = express();
// Middleware
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(limiter);



// Changing port Should also Change in client\src\utils\api.js  
// Changing port Should also Change in Third-Party-logins in Google-APi Credintials
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
    maxAge: 30 * 24 * 60 * 60 * 1000,
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
app.get('/error-demo', (req, res, next) => {
  try {
    throw new Error("This is a custom error message");
  } catch (error) {
    error.statusCode = 400; // Set a custom status code if needed
    next(error); // Pass error to custom error handler
  }
});


// Routes
app.use("/", home);
app.use("/auth", userRoutes);
app.use("/listings", listingRoutes);
app.use("/dashboard" , dashboardRoutes)
app.use("/comments" , commentRoutes)


app.use(errorHandler);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Logger middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} ${req.hostname}`);
  next();
});

// Routes
app.use("/", home);
app.use("/auth", userRoutes);
app.use("/listings", listingRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/comments", commentRoutes);

// Error handler middleware
app.use(errorHandler);

// Uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  console.error(err.stack);
  logger.error(`Unhandled Exception: ${reason}`);
  process.exit(1); // Restart the server with a process manager like PM2
});

// Global handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
logger.error(`Unhandled Rejection: ${reason}`);
});


// Handle graceful shutdown
const shutdown = () => {
  console.log("Received shutdown signal, gracefully shutting down...");
  
  // Close database connection, cleanup, or other services
  // Assuming `connectDB` has a close method for the database connection
  if (connectDB && connectDB.close) {
    connectDB.close().then(() => {
      console.log("Database connection closed.");
    }).catch((err) => {
      console.error("Error closing the database connection:", err);
    });
  }
  
  // Allow ongoing requests to finish
  server.close(() => {
    console.log("Closed all active connections.");
    process.exit(0); // Exit the process successfully
  });
  
  // Force exit after a timeout (in case there are still ongoing requests)
  setTimeout(() => {
    console.error("Forcefully shutting down due to timeout...");
    process.exit(1); // Force exit with error code
  }, 10000); // 10 seconds timeout
};

// Capture shutdown signals (e.g., Ctrl+C or process manager signal)
process.on('SIGINT', shutdown);  // Catch Ctrl+C
process.on('SIGTERM', shutdown); // Catch termination signal from process manager (e.g., PM2, Kubernetes)
  

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
require("dotenv").config();
const helmet = require('helmet');
const limiter = require("./utils/Limitar");
const xss = require('xss-clean');
const hpp = require('hpp');

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const home = require("./routes/users/home");
const connectDB = require("./config/db");
const cors = require("cors");
const { corsOptions } = require("./utils/cors");
const { initializeAdmin } = require("./controller/user/userController");

const userRoutes = require("./routes/users/userRoutes");
const loggedUser = require("./routes/users/auth");
const listingRoutes = require("./routes/listings/listingRoutes");
const dashboardRoutes = require("./routes/dashboard/dashboardRoute");
const commentRoutes = require("./routes/comment/commentRoutes");
const ConversationRoutes = require ("./routes/chats/ConversationRoutes")
const AgreementRoutes = require("./routes/aggrement/Aggreementt");
const BlockChainRoutes = require("./routes/blockchain/blockchain")
const HomeListings = require("./routes/home/HomelistingRoutes")
const Owner = require("./routes/owner/owner")
const Renter =require("./routes/renter/renter")
const Reviews =require("./routes/reviews/reviews")



const logger = require("./utils/logger");
const path = require('path');
const {errorHandler , notFound } = require("./middleware/errorHandler");
const AppError = require("../server/utils/AppError");
const asyncHandler = require("./middleware/asyncWrapper");
const {setupSocket , io , app , server} = require("./utils/socket");






connectDB();

require("./utils/third_party_Login");



// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(xss());
app.use(hpp());
app.set("io", io);

// app.use(limiter);



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


// app.get('/err', (req, res, next) => {
//   try {
//     throw new AppError("This is a custom error message");
//   } catch (error) {
//     error.statusCode = 400; // Set a custom status code if needed
//     next(error); // Pass error to custom error handler
//   }
// });



// logger
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} ${req.hostname}`);
  next();
})
app.get('/err', asyncHandler(async (req, res, next) => {
    throw new Error("This is a custom error message");
}));


// Passport middleware
app.use(passport.initialize());
// app.use(passport.session());

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
app.use("/agreement", AgreementRoutes);
app.use("/conversations" , ConversationRoutes)
app.use("/auth/user" , loggedUser )
app.use("/auth/blockchain" , BlockChainRoutes)
app.use("/Specificlistings" , HomeListings )
app.use("/owner", Owner )
app.use("/renter", Renter )
app.use("/reviews", Reviews )





// Error handler middleware
app.use(errorHandler);
app.use(notFound);
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success:err.success,  message: err.message });
  }
  res.status(500).json({ message: "Internal Server Error" });
});



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
process.exit(1);
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




// Start the server
server.listen(3600, () => {
  console.log("Server is running on port 3600");
});

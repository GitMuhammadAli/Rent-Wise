const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connectionString =
      process.env.DB_URL ||
      process.env.DB_URL_online;

    if (!connectionString) {
      throw new Error("Database connection string is not defined");
    }

    const connection = await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
    });

    return connection.connection;
  } catch (error) {
    console.log("Error connecting to the database:", error);
    throw error;
  }
};

module.exports = connectDB;
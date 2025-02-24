
const SENTIMENT_API_URL = "http://127.0.0.1:5000/predict";
module.exports = {
  corsOptions: {
    origin: [
      process.env.CLIENT_URL,
      SENTIMENT_API_URL,

    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  },
};

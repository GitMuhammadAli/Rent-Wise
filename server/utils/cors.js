module.exports = {
  corsOptions: {
    origin: ["http://localhost:4000", "http://127.0.0.1:5500", "http://localhost:5500"],
    // origin: process.env.CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  },
};



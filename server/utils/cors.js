module.exports = {
  corsOptions: {
    origin: [
      process.env.CLIENT_URL,
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  },
};

module.exports = {
  corsOptions: {
    origin: [
      "http://localhost:4000",
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "http://192.168.x.x:3600",
      "http://172.20.2.22:4000",
      "http://172.26.80.1:4000/",
      "http://172.28.3.72:4000/",
      "http://172.26.80.1:4000/",
      "http://192.168.63.249:4000/"

    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  },
};

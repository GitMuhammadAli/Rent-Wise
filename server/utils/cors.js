const DEFAULT_DEV_ORIGINS = ["http://localhost:4000", "http://127.0.0.1:4000"];

const buildOrigins = () => {
  const envOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const origins = [...envOrigins];

  if (process.env.CLIENT_URL) {
    origins.push(process.env.CLIENT_URL.trim());
  }

  if (!origins.length) {
    origins.push(...DEFAULT_DEV_ORIGINS);
  }

  return [...new Set(origins)];
};

module.exports = {
  corsOptions: {
    origin: buildOrigins(),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  },
};
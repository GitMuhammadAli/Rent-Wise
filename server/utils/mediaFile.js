const multer = require("multer");
const fs = require("fs");
const path = require("path");

const UserDynamicfile = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const MAX_FILE_SIZE_MB = Number(process.env.MEDIA_MAX_FILE_SIZE_MB || 25);
const uploadsRoot =
  process.env.UPLOADS_DIR ||
  path.join(__dirname, "../uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const listingId = req.listingId
    const userDirectory = path.join(uploadsRoot, `media/${listingId}`);
    UserDynamicfile(userDirectory);
    cb(null, userDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/png", "image/jpg", "image/jpeg", "image/gif", "image/webp",
    "video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo",
    "video/x-ms-wmv", "video/x-matroska", "video/x-flv", "video/x-ms-asf",
    "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
  },
});

module.exports = upload;

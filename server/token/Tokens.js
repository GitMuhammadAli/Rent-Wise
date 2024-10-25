const jsonwebtoken = require("jsonwebtoken");
const crypto = require('crypto');
require("dotenv").config();

const makeToken = async (_id) => {
  return jsonwebtoken.sign({ _id }, process.env.JWT_API_SECRET_KEY, {
    expiresIn: "30d",
  });
};


const GenerateToken = async (user, req, res) => {
  try {
    console.log("user in generate token", user);
    await res.clearCookie("jwt");
    const token = await makeToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      //   secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    });
    return token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const CreateToken = async (payload) => {
  const otptoken = jsonwebtoken.sign(payload, process.env.JWT_API_SECRET_KEY, {
    expiresIn: "5m",
  });
  return otptoken;
};

const generatetokenForOtpForEncryption = async (
  SendedOtp,
  expirationTime,
  _id,
  email,
  otpVerified = false,
  emailVerified = false,
  res
) => {
  const payload = {
    SendedOtp,
    expirationTime,
    _id,
    email,
    otpVerified,
    emailVerified,
  };
  
  // Encrypting OTP before signing token
  const encryptedOtp = encryptCookieForOtp(SendedOtp);

  // Create token with encrypted OTP
  const tok = await CreateToken({ ...payload, SendedOtp: encryptedOtp });

  if (res) {
    console.log("send encrypted OTP to cookie");
    res.cookie("resetPasswordOTP", tok, {
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
  }

  return tok;
};


const generatetokenForOtp = async (
  SendedOtp,
  expirationTime,
  _id,
  email,
  otpVerified = false,
  emailVerified = false,
  res
) => {
  const payload = {
    SendedOtp,
    expirationTime,
    _id,
    email,
    otpVerified,
    emailVerified,
  };
  const tok = await CreateToken(payload);

  if (res) {
    console.log("send to cookie");
    res.cookie("resetPasswordOTP", tok, {
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
  }

  return tok;
};

const decodingToken = async (token, key) => {
  return jsonwebtoken.verify(token, key);
};

const setEncryptedCookieForOtp = (res, cookieData) => {
  const encryptedData = encryptCookieForOtp(JSON.stringify(cookieData)); // Encrypting the entire cookie data

  res.cookie('resetPasswordToken', encryptedData, {
    httpOnly: true,
    secure: true, // Set this to true in production
    maxAge: 15 * 60 * 1000, // 15 minutes expiration
  });
};


const verifyEncryptedCookieForOtp = (req, res) => {
  const encryptedCookie = req.cookies.resetPasswordToken;

  if (!encryptedCookie) {
    return res.status(400).json({ success: false, message: 'No token provided' });
  }

  try {
    const decryptedData = decryptCookieForOtp(encryptedCookie);
    const cookieData = JSON.parse(decryptedData); // Parse the decrypted cookie data

    // Proceed with password reset verification logic
    return res.status(200).json({ success: true, data: cookieData });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Decryption failed', error });
  }
};

const encryptCookieForOtp = (text) => {
  const algorithm = 'aes-256-cbc'; // Encryption algorithm
  const secretKey = process.env.COOKIE_ENCRYPTION_KEY; // Secret key (256-bit)
  const iv = crypto.randomBytes(16); // Initialization vector

  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Return the encrypted data along with the IV, as both are needed for decryption
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};


const decryptCookieForOtp = (text) => {
  const algorithm = 'aes-256-cbc';
  const secretKey = process.env.COOKIE_ENCRYPTION_KEY;
  const textParts = text.split(':'); // Split the IV and encrypted data

  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');

  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};


const GetAndDecodeToken = async (req, res) => {
  const token = req.cookies.jwt; // Ensure req is passed

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedToken = await decodingToken(token, process.env.JWT_API_SECRET_KEY);
    console.log("decodedToken", decodedToken);
    return decodedToken; // Return the decoded token for further use
  } catch (error) {
    console.error("Error decoding token:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

  



module.exports = {
  GenerateToken,
  makeToken,
  CreateToken,
  generatetokenForOtp,
  decodingToken,
  GetAndDecodeToken
};

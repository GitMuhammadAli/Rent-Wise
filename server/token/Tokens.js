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
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      // sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      sameSite: "strict",
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
  try {
    const decoded = jsonwebtoken.verify(token, key);
    return { success: true, decoded };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { success: false, error: { status: 401, message: "Token has expired" } };
    }
    return { success: false, error: { status: 401, message: "Invalid token" } };
  }
};

const GetAndDecodeToken = async (req, res) => {
  const token = req.cookies.jwt; // Ensure req is passed

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedToken = await decodingToken(token, process.env.JWT_API_SECRET_KEY);
    console.log("decodedToken", decodedToken);
    return decodedToken; 
  } catch (error) {
    console.error("Error decoding token:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

  






//Encryption token for Otp & Decryption token for Otp

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
  
  console.log("payload", payload);
  const jsonStringPayloadForOtp = JSON.stringify(payload);

  const encryptedOtp = encryptCookieForOtp(jsonStringPayloadForOtp);
console.log("encryptedOtp", encryptedOtp);
  const tok = await CreateToken({ SendedOtp: encryptedOtp });

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






const setEncryptedCookieForOtp = (res, cookieData) => {
  const encryptedData = encryptCookieForOtp(JSON.stringify(cookieData)); // Encrypting the entire cookie data

  res.cookie('resetPasswordToken', encryptedData, {
    httpOnly: true,
    secure: true, // Set this to true in production
    maxAge: 15 * 60 * 1000, // 15 minutes expiration
  });
};


const verifyEncryptedCookieForOtp = (req, res ) => {
  const encryptedCookie = req.cookies.resetPasswordToken;

  if (!encryptedCookie) {
    return res.status(400).json({ success: false, message: 'No token provided' });
  }

  try {
    const decryptedData = decryptCookieForOtp(encryptedCookie);
    const cookieData = JSON.parse(decryptedData); // Parse the decrypted cookie data
    console.log("cookie for otp after decryption", cookieData);

    // Proceed with password reset verification logic
    return res.status(200).json({ success: true, data: cookieData });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Decryption failed', error });
  }
};

const encryptCookieForOtp = (text) => {
  if (typeof text !== 'string' || text.length === 0) {
    throw new TypeError('The text to encrypt must be a non-empty string.');
  }

  const algorithm = 'aes-256-cbc'; // Encryption algorithm
  const secretKey = process.env.COOKIE_ENCRYPTION_KEY; // Secret key (256-bit)
  
  if (!secretKey) {
    throw new Error('Secret key for encryption is not defined in environment variables.');
  }

  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Return the encrypted data along with the IV, as both are needed for decryption
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};




function decryptCookieForOtp(decodedToken) {
  const secretKeyHex = process.env.COOKIE_ENCRYPTION_KEY;

if (!secretKeyHex) {
  throw new Error('Secret key for encryption/decryption is not defined in environment variables.');
}

const secretKey = Buffer.from(secretKeyHex, 'hex');

if (secretKey.length !== 32) {
  throw new Error('Invalid key length. The key must be 32 bytes (64 hex characters) for AES-256-CBC.');
}

  const encryptedData = decodedToken.SendedOtp;
  const [ivHex, encryptedHex] = encryptedData.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);

  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}







module.exports = {
  GenerateToken,
  makeToken,
  CreateToken,
  // generatetokenForOtp,
  generatetokenForOtpForEncryption,
  decodingToken,
  verifyEncryptedCookieForOtp,
  decryptCookieForOtp,
  GetAndDecodeToken
};

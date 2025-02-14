const Users = require("../../model/user/userModel");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const logger = require("../../utils/logger");
const AppError = require("../../utils/AppError");

const { generatetokenForOtp, decodingToken, decodeTokenForRestPassword, decryptCookieForOtp, verifyEncryptedCookieForOtp, generatetokenForOtpForEncryption } = require("../../token/Tokens");
const sendMail = require("../../config/sendmail");
const { ERROR_MESSAGE } = require("../../messages/error");
const { RESPONCE_MESSAGE } = require("../../messages/response");
const { STATUS } = require("../../messages/status");
const forgetPasswordEmailTemplate = require("../../Mail/Templates/ForgetPassword");
const { ROLES , BOOLEAN} = require("../../utils/Roles");

const generateOTP = () => {
  let SendedOtp = otpGenerator.generate(6, {
    upperCase: BOOLEAN.FALSE,
    specialChars: BOOLEAN.FALSE,
  });
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 10);
  return { SendedOtp, expirationTime };
};

const CheckMailforForget = async (req, res ,next) => {
  const { email } = req.body;
  try {
    // if (!validator.isEmail(email)) {
    //   return res.status(400).json({ success: false, message: "Invalid email format." });
    // }
    const Findmail = await Users.findOne({ email });
    if (Findmail.role === ROLES.ADMIN) {
      return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.EMAIL_NOT_FOUND, STATUS.NOT_FOUND))
    } else if (Findmail == null) {
      return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.PROVIDE_EMAIL, STATUS.NOT_FOUND))
    } else {
      const { SendedOtp, expirationTime } = generateOTP();


      await generatetokenForOtpForEncryption(
        SendedOtp,
        expirationTime,
        Findmail._id,
        Findmail.email,
        (Findmail.otpVerified = BOOLEAN.FALSE),
        (Findmail.emailVerified = BOOLEAN.TRUE),
        res
      );

      const to = email;
      const ForgetPassEmail = await forgetPasswordEmailTemplate(SendedOtp);

      if (forgetPasswordEmailTemplate) {
        const emailResult = await sendMail(to, ForgetPassEmail);

        if (emailResult.success) {
          return res.status(STATUS.SUCCESS).json({
            success: BOOLEAN.TRUE,
            message: RESPONCE_MESSAGE.OTP_SENT_EMAIL_SENT,
          });
        } else {
          return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.OTP_SENDING_ERROR, STATUS.INTERNAL_SERVER_ERROR))
        }
      } else {
        return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.EMAIL_NOT_FOUND, STATUS.NOT_FOUND))
      }
    }
  } catch (error) {
    next(error);
  }
};









// OTP confirmation
const verifyOTP = async (userOTP, storedOTP, expirationTime) => {
  try {
    userOTP = userOTP.trim();
    storedOTP = storedOTP.trim();
    // console.log(
    //   `Comparing OTPs - User OTP: ${userOTP}, Stored OTP: ${storedOTP}`
    // );


    // console.log("Encrted Otp " + storedOTP);

    if (userOTP !== storedOTP) {
      // console.log("OTP mismatch");
      return BOOLEAN.FALSE;
    }
    const currentTime = new Date();
    // console.log(
    //   `Current Time: ${currentTime}, Expiration Time: ${expirationTime}`
    // );
    if (currentTime > expirationTime) {
      // console.log("OTP expired");
      return BOOLEAN.FALSE;
    }
    // console.log("OTP verified successfully");

    return BOOLEAN.TRUE;
  } catch (error) {
    return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.OTP_VERIFICATION_FAILED, STATUS.INTERNAL_SERVER_ERROR))
  }
};



const ConfirmOtp = async (req, res, next) => {
  const { otp } = req.body;
  const cookieOtp = req.cookies.resetPasswordOTP;

  // console.log("OTP from the cookie:", cookieOtp);

  if (!cookieOtp) {
    return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.OTP_NOT_PROVIDED, STATUS.NOT_FOUND));
  }

  try {
    const { success, decoded: decodedToken } = await decodingToken(cookieOtp, process.env.JWT_API_SECRET_KEY);
    if (!success) {
      return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.OTP_EXPIRED, STATUS.UNAUTHORIZED));
    }

    // console.log("Decoded Token:", decodedToken);

    // Decrypt and parse the token
    const decryptedDecodedToken = decryptCookieForOtp(decodedToken);
    const parsedToken = JSON.parse(decryptedDecodedToken);

    // console.log("Decoded Token after decryption:", parsedToken);

    const { SendedOtp, expirationTime, emailVerified, _id, email } = parsedToken;

    if (!SendedOtp) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ success: BOOLEAN.FALSE, message: ERROR_MESSAGE.OTP_TIMEOUT });
    }

    if (emailVerified) {
      // console.log("Email is already verified.");

      const isOtpValid = await verifyOTP(otp, SendedOtp, new Date(expirationTime));
      if (isOtpValid) {
        // console.log("OTP verified successfully.");

        // Generate a new token and set the cookie
        await generatetokenForOtpForEncryption(
          SendedOtp,
          expirationTime,
          _id,
          email,
          (parsedToken.otpVerified = BOOLEAN.TRUE),
          (parsedToken.emailVerified = BOOLEAN.TRUE),
          res
        );

        return res
          .status(STATUS.SUCCESS)
          .json({ success: BOOLEAN.TRUE, message: RESPONCE_MESSAGE.OTP_VERIFIED });
      } else {
        // console.log("OTP verification failed or expired.");

        res.clearCookie("resetPasswordOTP");
        return res.status(STATUS.BAD_REQUEST).json({
          success: BOOLEAN.FALSE,
          message: ERROR_MESSAGE.OTP_VERIFICATION_FAILED,
        });
      }
    } else {
      // console.log("Email not verified.");
      return res
        .status(STATUS.BAD_REQUEST)
        .json({ success: BOOLEAN.FALSE, message: ERROR_MESSAGE.PROVIDE_REGISTER_EMAIL });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
     return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.OTP_EXPIRED, STATUS.UNAUTHORIZED));
    }

    // Pass unexpected errors to the error-handling middleware
    next(error);
  }
};



// New password
const CreateNewPassword = async (req, res , next) => {
  try {
    const Cookie = req.cookies.resetPasswordOTP;
    // console.log("Cookie is ", Cookie);

    const { Password, RepeatPassword } = req.body;
    if (!Cookie) {
      return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.OTP_NOT_PROVIDED, STATUS.NOT_FOUND));
    }

    const { success, decoded: decodedToken } = await decodingToken(Cookie, process.env.JWT_API_SECRET_KEY);
    if (!success) {
      return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.OTP_EXPIRED, STATUS.UNAUTHORIZED));
    }

    // console.log("Decoded Token:", decodedToken);

    // Decrypt the token to get the OTP and other details
    const decrpyptedDecodedToken = decryptCookieForOtp(decodedToken);
    const parsedToken = JSON.parse(decrpyptedDecodedToken);

    // console.log("Decoded Token after decryption:", parsedToken);



    if (parsedToken.otpVerified === BOOLEAN.FALSE) {
      return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.OTP_EXPIRED, STATUS.GATEWAY_TIMEOUT));
    }
    // console.log(Password);
    // console.log(RepeatPassword);
    if (!Password || !RepeatPassword) {
      return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.PASSWORD_MISSING, STATUS.BAD_REQUEST));
    }
    if (Password !== RepeatPassword) {
      return  next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.PASSWAORD_NOT_MATCHED, STATUS.BAD_REQUEST));
    }

    const { _id } = parsedToken;
    const hashedPassword = await bcrypt.hash(Password, 10);
    const user = await Users.findByIdAndUpdate(
      _id,
      { password: hashedPassword },
      { new: BOOLEAN.TRUE },
      {
        updatedAt: Date.now(),
      }
    );

    if (!user) {
      return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.USER_NOT_FOUND, STATUS.NOT_FOUND));
    } else {

      res.clearCookie("resetPasswordOTP");
      res.clearCookie("jwt");

      return res.json({
        success: BOOLEAN.TRUE,
        message: RESPONCE_MESSAGE.PASSWORD_CHANGED,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  CheckMailforForget,
  ConfirmOtp,
  CreateNewPassword,
};
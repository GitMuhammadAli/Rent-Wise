const Users = require("../../model/user/userModel");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const logger = require("../../utils/logger");

const { generatetokenForOtp, decodingToken , decodeTokenForRestPassword , decryptCookieForOtp,verifyEncryptedCookieForOtp,generatetokenForOtpForEncryption } = require("../../token/Tokens");
const sendMail = require("../../config/sendmail");
const { ERROR_MESSAGE } = require("../../messages/error");
const { RESPONCE_MESSAGE } = require("../../messages/response");
const { STATUS } = require("../../messages/status");

const generateOTP = () => {
  let SendedOtp = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
  });
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 10);
  return { SendedOtp, expirationTime };
};

const CheckMailforForget = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    // if (!validator.isEmail(email)) {
    //   return res.status(400).json({ success: false, message: "Invalid email format." });
    // }

    

    const Findmail = await Users.findOne({ email });
    if (Findmail.role === "admin") {
      return res.json({
        success: false,
        message: ERROR_MESSAGE.EMAIL_NOT_FOUND,
        status: STATUS.NOT_FOUND,
      });
    } else if (Findmail == null) {
      return res.json({
        success: false,
        message: ERROR_MESSAGE.PROVIDE_EMAIL,
        status: STATUS.NOT_FOUND,
      });
    } else {
      const { SendedOtp, expirationTime } = generateOTP();


       await generatetokenForOtpForEncryption(
        SendedOtp,
        expirationTime,
        Findmail._id,
        Findmail.email,
        (Findmail.otpVerified = false),
        (Findmail.emailVerified = true),
        res
      );

      const to = email;
      const subject = "Your OTP for Resetting the Password";
      const text = `Your OTP is ${SendedOtp}. It expires in 2 minutes.`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #333;">Reset Password</h2>
          <p style="font-size: 16px; color: #333;">
            Dear User,
          </p>
          <p style="font-size: 16px; color: #333;">
            You have requested to reset your password. Please use the following One-Time Password (OTP) to proceed with resetting your password. This OTP is valid for 2 minutes.
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #333; background: #f0f0f0; padding: 10px 20px; border-radius: 5px; display: inline-block;">
              ${SendedOtp}
            </span>
          </div>
          <p style="font-size: 16px; color: #333;">
            If you did not request a password reset, please ignore this email.
          </p>
          <p style="font-size: 16px; color: #333;">
            Thank you,
            <br>
            The Support Team
          </p>
        </div>
      `;

      const emailResult = await sendMail(to, subject, text, html);

      if (emailResult.success) {
        return res.status(STATUS.SUCCESS).json({
          success: true,
          message: RESPONCE_MESSAGE.OTP_SENT_EMAIL_SENT,
        });
      } else {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ERROR_MESSAGE.OTP_SENDING_ERROR,
        });
      }
    }
  } catch (error) {
    logger.error('Error in CheckMailforForget:', error);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGE.SERVER_ERROR,
    });
  }
};









// OTP confirmation
const verifyOTP = async (userOTP, storedOTP, expirationTime) => {
  try {
    userOTP = userOTP.trim();
    storedOTP = storedOTP.trim();
    console.log(
      `Comparing OTPs - User OTP: ${userOTP}, Stored OTP: ${storedOTP}`
    );

   
    console.log("Encrted Otp " + storedOTP);

    if (userOTP !== storedOTP) {
      console.log("OTP mismatch");
      return false;
    }
    const currentTime = new Date();
    console.log(
      `Current Time: ${currentTime}, Expiration Time: ${expirationTime}`
    );
    if (currentTime > expirationTime) {
      console.log("OTP expired");
      return false;
    }
    console.log("OTP verified successfully");

    return true;
  } catch (error) {
    logger.error('Error in verifyOTP:', error);
    return false;
  }
};



const ConfirmOtp = async (req, res) => {
  const { otp } = req.body;
  const cookieOtp = req.cookies.resetPasswordOTP;

  console.log("OTP from the cookie:", cookieOtp);

  if (!cookieOtp) {
    return res
      .status(STATUS.NOT_FOUND)
      .json({ success: false, message: ERROR_MESSAGE.OTP_NOT_PROVIDED });
  }

  try {
    const { success, decoded: decodedToken } = await decodingToken(cookieOtp, process.env.JWT_API_SECRET_KEY);
    if (!success) {
      return res.status(STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGE.OTP_EXPIRED,
      });
    }

    console.log("Decoded Token:", decodedToken);
    // Decrypt the token to get the OTP and other details
    
    

    const decrpyptedDecodedToken = decryptCookieForOtp(decodedToken);
    console.log(typeof decrpyptedDecodedToken);


    // Convert the decrypted string into an object
    const parsedToken = JSON.parse(decrpyptedDecodedToken);
  
    console.log("Decoded Token after decryption:", parsedToken);

    // Extract necessary fields
    const { SendedOtp, expirationTime, emailVerified, _id, email, otpVerified } =
    parsedToken;

    console.log(`SendedOtp: ${SendedOtp}, Expiration Time: ${expirationTime}`);

    // Check if the OTP is present
    if (!SendedOtp) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ success: false, message: ERROR_MESSAGE.OTP_TIMEOUT });
    }

    // Check if the email is already verified
    if (emailVerified === true) {
      console.log("Email is already verified.");

      // Verify the OTP entered by the user
      console.log(otp , SendedOtp, new Date(expirationTime));
      const isOtpValid = await verifyOTP(otp, SendedOtp, new Date(expirationTime));
      if (isOtpValid) {
        console.log("OTP verified successfully.");

        // Generate a new token after OTP verification
        await generatetokenForOtpForEncryption(
          SendedOtp,
          expirationTime,
          _id,
          email,
          (decrpyptedDecodedToken.otpVerified = true),
          (decrpyptedDecodedToken.emailVerified = true),
          res
        );

        return res
          .status(STATUS.SUCCESS)
          .json({ success: true, message: RESPONCE_MESSAGE.OTP_VERIFIED });
      } else {
        console.log("OTP verification failed or expired.");

        // Clear the OTP cookie as it is invalid
        res.clearCookie("resetPasswordOTP");
        return res.status(400).json({
          success: false,
          message: ERROR_MESSAGE.OTP_VERIFICATION_FAILED,
        });
      }
    } else {
      console.log("Email not verified.");
      return res
        .status(400)
        .json({ success: false, message: ERROR_MESSAGE.PROVIDE_REGISTER_EMAIL });
    }
  } catch (error) {
    console.error("Error in ConfirmOtp:", error);

    // Handle token expiration errors
    if (error.name === "TokenExpiredError") {
      return res.status(STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGE.TOKEN_EXPIRED,
      });
    }

    // Handle any other server errors
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
    });
  }
};


// New password
const CreateNewPassword = async (req, res) => {
  try {
    const Cookie = req.cookies.resetPasswordOTP;
    console.log("Cookie is ", Cookie);

    const { Password, RepeatPassword } = req.body;
    if (!Cookie) {
      return res.json({
        message: ERROR_MESSAGE.OTP_NOT_PROVIDED,
        success: false,
        status: 404,
      });
    }

    const { success, decoded: decodedToken } = await decodingToken(Cookie, process.env.JWT_API_SECRET_KEY);
    if (!success) {
      return res.status(STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGE.OTP_EXPIRED,
      });
    }

    console.log("Decoded Token:", decodedToken);
    // Decrypt the token to get the OTP and other details
    
    

    const decrpyptedDecodedToken = decryptCookieForOtp(decodedToken);
    // const decodedToken = await decodingToken(
    //   Cookie,
    //   process.env.JWT_API_SECRET_KEY
    // );


    const parsedToken = JSON.parse(decrpyptedDecodedToken);
  
    console.log("Decoded Token after decryption:", parsedToken);



    if (parsedToken.otpVerified === false) {
      return res.json({
        success: false,
        message: ERROR_MESSAGE.OTP_EXPIRED,
        status: STATUS.GATEWAY_TIMEOUT,
      });
    }
    console.log(Password);
    console.log(RepeatPassword);
    if (!Password || !RepeatPassword) {
      return res.json({ success: false, message: ERROR_MESSAGE.PASSWORD_MISSING });
    }
    if (Password !== RepeatPassword) {
      return res.json({ success: false, message: ERROR_MESSAGE.PASSWAORD_NOT_MATCHED });
    }

    const { _id } = parsedToken;
    console.log(_id);
    const hashedPassword = await bcrypt.hash(Password, 10);
    console.log(hashedPassword);
    const user = await Users.findByIdAndUpdate(
      _id,
      { password: hashedPassword },
      { new: true },
      {
        updatedAt: Date.now(),
      }
    );

    console.log(user.password);
    if (!user) {
      return res.json({ success: false, message: ERROR_MESSAGE.USER_NOT_FOUND });
    } else {
      console.log(user);

      res.clearCookie("resetPasswordOTP");
      res.clearCookie("jwt");

      return res.json({
        success: true,
        message: RESPONCE_MESSAGE.PASSWORD_CHANGED,
      });
    }
  } catch (error) {
    logger.error('Error in CreateNewPassword:', error);
    return res.json({ success: false, message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR });
  }
};

module.exports = {
  CheckMailforForget,
  ConfirmOtp,
  CreateNewPassword,
};
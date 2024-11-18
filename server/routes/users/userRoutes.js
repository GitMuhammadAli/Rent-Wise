const express = require("express");
const router = express.Router();
const userController = require("../../controller/user/userController");
const passwardController = require("../../controller/password/passwordController");
const passport = require("passport");
const  asyncHandler = require('../../middleware/asyncWrapper');


// Functional routes
router.post("/register", asyncHandler(userController.Register));
router.post("/login", asyncHandler(userController.login));
router.post("/forget-password", asyncHandler(passwardController.CheckMailforForget));
router.post("/verify-otp", asyncHandler(passwardController.ConfirmOtp));
router.post("/reset-password", asyncHandler(passwardController.CreateNewPassword));
// router.get("/account", userController.UserAccount);
router.get("/logout", asyncHandler(userController.logout));

// Google authentication routes
router.get(
  "/google",
  (req, res, next) => {
    console.log("Google authentication initiated");
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/fail",
    failureMessage: "Failed to authenticate. Go back and try again.",
  }),
  userController.handleGoogleCallback
);

// Facebook authentication routes
// router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
// router.get('/facebook/callback',
//     passport.authenticate('facebook', { failureRedirect: '/auth/signin' }),
//     (req, res) => {
//         req.logIn(req.user, (err) => {
//             if (err) {
//                 return res.redirect('/auth/signin');
//             }

//             res.redirect('/');
//         });
//     }
// );

module.exports = router;

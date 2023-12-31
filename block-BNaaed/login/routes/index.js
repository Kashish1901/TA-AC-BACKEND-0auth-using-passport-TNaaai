var express = require("express");
var router = express.Router();
var passport = require("passport");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/success", (req, res) => {
  res.render("success");
});

router.get("/failure", (req, res) => {
  res.render("failure");
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
  }),
  (req, res) => {
    res.redirect("/success");
  }
);
module.exports = router;

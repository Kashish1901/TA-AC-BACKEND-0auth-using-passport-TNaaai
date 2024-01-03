var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var User = require("../models/User");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      var profileData = {
        googleId: profile.id,
        username: profile.displayName,
        name: profile._json.name,
        photo: profile._json.picture,
      };
      console.log(profile);
      var user = await User.findOne(
        { googleId: profile.id },
        "googleId username name"
      );
      if (!user) {
        var addedUser = await User.create(profileData);
        return done(null, addedUser);
      } else {
        return done(null, user);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  var user = await User.findById(id, "name  username");
  done(null, user);
});

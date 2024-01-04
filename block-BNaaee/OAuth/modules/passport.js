var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth2").Strategy;
var GitHubStrategy = require("passport-github").Strategy;
var User = require("../models/User");
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);

      var email = profile._json.email;
      var githubUser = {
        email: email,
        providers: [profile.provider],
        github: {
          name: profile.displayName,
          username: profile.username,
          image: profile._json.avatar_url,
        },
      };
      var user = await User.findOne({ email });
      console.log(user);
      if (!user) {
        var addedUser = await User.create(githubUser);
        return done(null, addedUser);
      } else {
        return done(null, user);
      }

      if (user.providers.includes(profile.provider)) {
        return done(null, user);
      } else {
        user.providers.push(profile.provider);
        user.github = { ...githubUser.github };
        user.save((err, updatedUser) => {
          done(null, updatedUser);
        });
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      console.log(profile);
      var email = profile._json.email;
      var googleUser = {
        email: email,
        providers: [profile.provider],
        google: {
          name: profile.displayName,
          username: profile.username,
          image: profile._json.picture,
        },
      };
      var user = await User.findOne({ email });
      console.log(user);
      if (!user) {
        var addedUser = await User.create(googleUser);
        return done(null, addedUser);
      } else {
        return done(null, user);
      }
      if (user.providers.includes(profile.provider)) {
        return done(null, user);
      } else {
        user.providers.push(profile.provider);
        user.google = { ...googleUser.google };
        user.save((err, updatedUser) => {
          done(null, updatedUser);
        });
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  var user = await User.findById(id, "name ");
  done(null, user);
});

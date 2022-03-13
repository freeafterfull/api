const Strategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const Users = require("../models/userModel");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

const auth = (passport) => {
  passport.use(
    new Strategy(opts, async (payload, done) => {
      const user = await Users.findById(payload.id);

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
  );
};

module.exports = auth;

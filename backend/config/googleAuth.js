const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../db/database');
const jwt = require('jsonwebtoken');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
    callbackURL: "/api/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      const email = profile.emails[0].value;
      const googleId = profile.id;
      const name = profile.displayName;

      let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      let user = result.rows[0];

      if (!user) {
        // Create new user. First user becomes Admin? Let's check user count.
        const userCountRes = await pool.query('SELECT COUNT(*) FROM users');
        const count = parseInt(userCountRes.rows[0].count);
        const role = count === 0 ? 'admin' : 'manager';

        const insertQuery = `
          INSERT INTO users (name, email, password, google_id, role)
          VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;
        result = await pool.query(insertQuery, [name, email, null, googleId, role]);
        user = result.rows[0];
      } else if (!user.google_id) {
        // Link google account
        await pool.query('UPDATE users SET google_id = $1 WHERE id = $2', [googleId, user.id]);
        user.google_id = googleId;
      }

      return cb(null, user);
    } catch (err) {
      return cb(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch(err) {
    done(err, null);
  }
});

module.exports = passport;

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

const GOOGLE_CLIENT_ID = "248496549011-aiv3ce4u6a5lb0k0ggavjkoqkofj4mib.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport?.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "/user/google/callback",
        },
        function (accessToken, refreshToken, profile, done) {
            done(null, profile);
        }
    )
);
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
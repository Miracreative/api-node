const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require('../config/keys');
const db = require('../db');
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.jwt
}
module.exports = passport => {
    passport.use(new JwtStrategy(options, async function(payload, done) {
        const user = await db.query(`SELECT * FROM users WHERE id = $1::int`, [payload.id])
        try {
            if(user.rows[0].role == 'admin') {
                done(null, user)
            } else {
                done(null, false)
            }
        } catch(e) {
            console.log(e)
        }
        
    }));
} 
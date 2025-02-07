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
                console.log('admin')
            } else {
                console.log('user')
                done(null, false)
            }
            done(null, user)
        } catch(e) {
            console.log(e)
        }
        
    }));
} 
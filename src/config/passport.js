const res = require('express/lib/response');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/User');

passport.use(new LocalStrategy({
    usernameField: 'name_form',
    passwordField: 'password'
}, async (name_form, password, done) => {
    
    // Comprobar si existe el usuario
    const name = name_form.toUpperCase()
    const user = await User.findOne({ name })
    if(!user) {
        return done(null, false, { message: 'No se encontró el usuario' })
    } else {
        // Validar contraseña
        const match = await user.matchPassword( password )
        if (match) {
            return done(null, user)
        } else {
            return done(null, false, { message: 'Contraseña incorrecta' })
        }
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

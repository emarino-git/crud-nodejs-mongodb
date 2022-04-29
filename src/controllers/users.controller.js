const usersCtrl = {}
const User = require('../models/User');
const passport = require('passport');

usersCtrl.renderSignUpForm = (req, res) => {
    res.render('users/signup')
}

usersCtrl.signup = async (req, res) => {
    const errors = []
    const { name, email, password, confirm_password } = req.body
    if (password != confirm_password) {
        errors.push({ text: 'Las contraseñas no coinciden' })
    }
    if (password.length < 4) {
        errors.push({ text: 'La contraseña debe ser de al menos 4 caracteres' })
    }
    if (errors.length > 0) {
        res.render('users/signup', {
            errors,
            name,
            email,
            password,
            confirm_password
        })
    } else {
        const userUnique = await User.findOne({name: name})
        if (userUnique) {
            req.flash('error_msg', 'El usuario ya existe')
            res.redirect('/users/signup')
        } else {
            const newUser = new User({name, email, password})
            newUser.password = await newUser.encryptPassword(password)
            await newUser.save()
            req.flash('succes_msg', 'Estas registrado')
            res.redirect('/users/signin')
        }
    }
}

usersCtrl.renderSigninForm = (req, res) => {
    res.render('users/signin')
}

usersCtrl.signin = passport.authenticate('local', {
    failureRedirect: '/users/signin',
    successRedirect: '/notes',
    failureFlash: true 
})

usersCtrl.logout = (req, res) => {
    req.logout()
    req.flash('success_msg', 'Su sesión ha sido cerrada')
    res.redirect('/users/signin')

}

module.exports = usersCtrl
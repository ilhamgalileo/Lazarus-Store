module.exports = app => {
    const userController = require('../controllers/user')
    const r = require('express').Router()

    // Rute untuk registrasi
    r.post('/register', userController.register)

    // Rute untuk login
    r.post('/login', userController.login)

    app.use("/user", r) 
}

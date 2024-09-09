module.exports = app => {
    const user = require('../controllers/user')
    const r = require('express').Router()
    const {authenticate, authorizeAdmin} = require('../middlewares/middleware')

    r.get('/all', authenticate, authorizeAdmin, user.getAllUsers)
    r.put('/update', authenticate, user.updateUserProfile)
    r.get('/profile', authenticate, user.getUserProfile)
    r.post('/register', user.register)
    r.post('/login', user.login)
    r.post('/logout', user.logout)
    app.use("/user", r) 
}

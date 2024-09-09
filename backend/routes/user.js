module.exports = app => {
    const user = require('../controllers/user')
    const r = require('express').Router()
    const {authenticate, authorizeAdmin} = require('../middlewares/middleware')

    r.get('/all', authenticate, authorizeAdmin, user.getAllUsers)
    r.get('/profile', authenticate, user.getUserProfile)
    r.get('/:id', authenticate, authorizeAdmin, user.getUserById)
    r.put('/update', authenticate, user.updateUserProfile)
    r.post('/register', user.register)
    r.post('/login', user.login)
    r.post('/logout', user.logout)
    r.delete('/delete/:id', authenticate, authorizeAdmin, user.deleteUserbyAdmin)

    app.use("/user", r) 
}

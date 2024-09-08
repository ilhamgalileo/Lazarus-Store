const db = require('../models/db')
const User = db.user
const jwt = require('jsonwebtoken')

exports.loginUser = async (req, res) => {
    const { email, name, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ msg: 'user invalid' })
        }
        const isMatch = bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ msg: 'password salah silahkan masukkan dengan benar'})
        }

        const payload = {
            user: {
                id: user.id,
            },
        }
        jwt.sign(payload, 'secretoken', {expiresIn: '1h'}, (err,token) =>{
            if(err) throw err
            res.json({token}) 
        })
    } catch(err) {
        res.status(500).json({msg:'internal server error'})
    }
}
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(400).json({
            status: 'error',
            message: 'Email sudah ada'
        })
    }
    const user = new User({ name, email, password })
    await user.save()

    res.status(201).json({
        status: 'success',
        message: 'Pendaftaran berhasil',
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    })
})

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        return res.status(400).json({
            status: 'error',
            message: 'Email atau password salah'
        })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        return res.status(400).json({
            status: 'error',
            message: 'Email atau password salah'
        })
    }

    const token = jwt.sign({
        _id: user._id,
        name: user.name,
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.cookie('authToken', token, { httpOnly: true, maxAge: 3600000 }) // 1 jam

    res.status(200).json({
        status: 'success',
        message: 'Login berhasil',
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    })
})
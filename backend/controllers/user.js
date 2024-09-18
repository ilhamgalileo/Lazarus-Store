const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

exports.register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(400).json({
            status: 'error',
            message: 'Email sudah ada'
        })
    }
    const user = new User({ username, email, password })
    await user.save()

    res.status(201).json({
        status: 'success',
        message: 'Pendaftaran berhasil',
        user: {
            id: user._id,
            username: user.username,
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
        name: user.username,
        email: user.email,
        isAdmin: user.isAdmin
    }, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.cookie('authToken', token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 30 * 24 * 60 * 60 *1000 ,
    }) 

    res.status(200).json({
        status: 'success',
        message: 'Login berhasil',
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin
        }
    })
})

exports.logout = asyncHandler(async (req,res) =>{
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    })
    res.status(200).json({message: "Logout Berhasil"})
})

exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password') // Mengambil semua pengguna tanpa password
    res.status(200).json({
        status: 'success',
        users
    })
})

exports.getUserById = asyncHandler(async (req,res) =>{
    const user = await User.findById(req.params.id)

    if(user){
    res.json({user})
    }else{
        res.status(404).json({message: 'pengguna tidak ditemukan'})
    }
})

exports.getUserProfile = asyncHandler(async (req, res) =>{
    const user = await User.findById(req.user._id)

    if(user){
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email
        })
    } else{
        res.status(404).send("pengguna tidak ditemukan")
    }
})

exports.updateProfile = asyncHandler(async (req, res)=>{
    const user = await User.findById(req.user._id)

    if(user){
        user.username = req.body.username || user.username
        user.email = req.body.email || user.email

        if(req.body.password){
            user.password = req.body.password
        }
        const updatedUser = await user.save()

        res.json({  
           user: {
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
           }
        })
    } else{
        res.status(404).json({message: "pengguna tidak ditemukkan"})
    }
})

exports.deleteUserbyAdmin = asyncHandler( async (req,res) =>{
    const user = await User.findById(req.params.id)

    if(user){
        if(user.isAdmin){
            res.status(400).json({message: 'tidak bisa hapus akun admin'})
        }
        await User.findOneAndDelete({ _id: user._id,})
        res.json({message: 'berhasil menghapus akun'})
    }else{
        res.status(404).json({message: 'pengguna tidak ditemukan'})
    }

})
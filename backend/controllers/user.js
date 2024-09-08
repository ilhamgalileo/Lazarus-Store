const { db } = require('../config/db')
const User = db.user
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    const { name, email, password } = req.body

    try {
        // Membuat pengguna baru berdasarkan input dari body request
        const user = new User({ name, email, password })

        // Menyimpan pengguna baru ke database
        await user.save()

        return res.status(201).json({
            status: 'success',
            message: 'Pendaftaran berhasil',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        console.error('Error during registration:', error)
        
        // Cek apakah error adalah ValidationError
        if (error.name === 'ValidationError') {
            // Mengumpulkan semua pesan error ke dalam array
            const messages = Object.values(error.errors).map(err => err.message)
            return res.status(400).json({
                status: 'error',
                message: messages.join(', ')
            })
        }

        // Menangani error lainnya
        return res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan saat pendaftaran'
        })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body

    try {
        // Cari pengguna berdasarkan email
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Email atau password salah'
            })
        } console.log(user.password)

        // Verifikasi password
        const isPasswordMatch = await bcrypt.hashSync(password, user.password)
        if (!isPasswordMatch) {
            return res.status(400).json({
                status: 'error',
                message: 'Email atau password salah'
            })
        }

        // Generate JWT token
        const token = jwt.sign({
            _id: user._id,
            name: user.name,
            email: user.email
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })
        return res.status(200).json({
            status: 'success',
            message: 'Login berhasil',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        console.error('Error during login:', error)
        return res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan server'
        })
    }
}


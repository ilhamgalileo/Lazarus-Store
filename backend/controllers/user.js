import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

export const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            status: 'error',
            message: 'Email sudah ada',
        })
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({
        status: 'success',
        message: 'Pendaftaran berhasil',
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
        },
    })
})

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return res.status(400).json({
            status: 'error',
            message: 'Email atau password salah',
        })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        return res.status(400).json({
            status: 'error',
            message: 'Email atau password salah',
        })
    }

    const token = jwt.sign(
        {
            _id: user._id,
            name: user.username,
            email: user.email,
            superAdmin: user.superAdmin,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )

    res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
        status: 'success',
        message: 'Login berhasil',
        token,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            superAdmin: user.superAdmin,
            isAdmin: user.isAdmin,
        },
    })
})

export const logout = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logout Berhasil" })
})

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.json(users)
})

export const getUserCount = asyncHandler(async (req, res) => {
    const userCount = await User.countDocuments({
        isAdmin: null,
        // superAdmin: false,
    })
    res.status(200).json({
        userCount,
    })
})

export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        res.json({ user });
    } else {
        res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }
})

export const updateUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        user.username = req.body.username || user.username
        user.email = req.body.email || user.email
        user.isAdmin = Boolean(req.body.isAdmin)

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})

export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
        })
    } else {
        res.status(404).send("Pengguna tidak ditemukan");
    }
})

export const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email

        if (req.body.password) {
            user.password = req.body.password
        }
        const updatedUser = await user.save()

        res.json({
            user: {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
            },
        })
    } else {
        res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }
})

export const deleteUserByAdmin = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    })

    if (user) {
        if (user.isAdmin) {
            res.status(400).json({ message: 'Tidak bisa hapus akun admin' })
        }
        await User.findOneAndDelete({ _id: user._id })
        res.json({ message: 'Berhasil menghapus akun' })
    } else {
        res.status(404).json({ message: 'Pengguna tidak ditemukan' })
    }
})
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

exports.authenticate = asyncHandler(async(req, res, next) => {
    const authHeader = req.headers.authorization
    console.log("1", authHeader)

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            message: 'Access denied. No token provided.',
        })
    }

    const token =  authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(403).json({
            status: 'error',
            message: 'Invalid token.',
        })
    }
})

exports.authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401).json({ message: "Not authorized as an Admin" })
    }
}
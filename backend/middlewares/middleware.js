const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            message: 'Access denied. No token provided.',
        })
    }

    const token =  req.header('Authorization')?.replace('Bearer ', '')

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
}

module.exports = authenticate
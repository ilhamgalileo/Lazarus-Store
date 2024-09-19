const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

exports.authenticate = asyncHandler(async (req, res, next) => {
    const token = req.cookies.authToken;
    console.log("Token from cookie:", token);

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Access denied. No token provided.',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(403).json({
            status: 'error',
            message: 'Invalid token.',
        });
    }
});

exports.authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: "Not authorized as an Admin" });
    }
};
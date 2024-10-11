import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

export const authenticate = asyncHandler(async (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Access denied. No token provided.',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            _id: decoded._id,
            username: decoded.name, 
            isAdmin: decoded.isAdmin,
        }
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(403).json({
            status: 'error',
            message: 'Token expired.',
        });
    }
});

export const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401).json({ message: "Not authorized as an Admin" })
    }
};

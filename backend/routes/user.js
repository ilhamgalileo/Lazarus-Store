import express from 'express'
const router = express.Router()
import * as user from '../controllers/user.js'
import { authenticate, authorizeAdmin } from '../middlewares/middleware.js'
// Definisikan rute
// Route untuk mendapatkan semua user (admin only)
router.get('/', authenticate, authorizeAdmin, user.getAllUsers);

// Routes untuk login, logout, dan register
router.post('/auth', user.login)
router.post('/logout', authenticate, user.logout)
router.post('/register', user.register)

// Routes untuk profile user sendiri (hanya user yang terautentikasi)
router
  .route('/profile')
  .get(authenticate, user.getUserProfile)
  .put(authenticate, user.updateProfile)

// Routes untuk operasi berbasis ID (hanya admin)
router
  .route('/:id')
  .get(authenticate, authorizeAdmin, user.getUserById)
  .put(authenticate, authorizeAdmin, user.updateUserById)
  .delete(authenticate, authorizeAdmin, user.deleteUserByAdmin)

export default router
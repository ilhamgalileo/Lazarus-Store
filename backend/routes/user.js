const express = require('express')
const router = express.Router()
const user = require('../controllers/user')
const { authenticate, authorizeAdmin } = require('../middlewares/middleware')

// Definisikan rute
// Route untuk mendapatkan semua user (admin only)
router.get('/all', authenticate, authorizeAdmin, user.getAllUsers);

// Routes untuk login, logout, dan register
router.post('/auth', user.login); // Login user
router.post('/logout', authenticate, user.logout); // Logout user
router.post('/register', user.register); // Register user

// Routes untuk profile user sendiri (hanya user yang terautentikasi)
router
  .route('/profile')
  .get(authenticate, user.getUserProfile) // Mendapatkan profil user sendiri
  .put(authenticate, user.updateProfile); // Update profil user sendiri

// Routes untuk operasi berbasis ID (hanya admin)
router
  .route('/:id')
  .get(authenticate, authorizeAdmin, user.getUserById) // Mendapatkan user berdasarkan ID (admin only)
  .put(authenticate, authorizeAdmin, user.updateUserById) // Update user berdasarkan ID (admin only)
  .delete(authenticate, authorizeAdmin, user.deleteUserbyAdmin); // Hapus user berdasarkan ID (admin only)

module.exports = router
import express from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/middleware.js'; // Pastikan untuk menggunakan .js
import * as category from '../controllers/category.js'; 

const router = express.Router();

router.post('/', authenticate, authorizeAdmin, category.createCate);
router.put('/:categoryId', authenticate, authorizeAdmin, category.updateCate);
router.delete('/:categoryId', authenticate, authorizeAdmin, category.removeCate);
router.get('/list', authenticate, authorizeAdmin, category.categoryList);
router.get('/:id', authenticate, authorizeAdmin, category.findOne);

export default router;

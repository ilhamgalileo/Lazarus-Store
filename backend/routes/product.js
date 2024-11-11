import express from 'express';
import * as product from '../controllers/product.js'; // Pastikan untuk menggunakan .js
import { authenticate, authorizeAdmin } from '../middlewares/middleware.js'; // Pastikan untuk menggunakan .js
import checkId from '../middlewares/checkId.js'; // Pastikan untuk menggunakan .js
import { uploadImages } from '../middlewares/upload.js';

const router = express.Router();

router.get('/', authenticate, product.FindMany);
router.get('/top', product.fetchTopProducts);
router.get('/new', product.fetchNewProducts);
router.post('/:id/reviews', authenticate, checkId, product.addProductReview);
router.get('/all', product.fetchAllProducts);
router.get('/:id', authenticate, product.findOne);
router.post('/', authenticate, authorizeAdmin, uploadImages, product.createProduct);
router.put('/:id', authenticate, authorizeAdmin, uploadImages, product.update);
router.delete('/:id', authenticate, authorizeAdmin, product.deleteProduct);
router.post('/filtered-products', product.filterProducts)

export default router

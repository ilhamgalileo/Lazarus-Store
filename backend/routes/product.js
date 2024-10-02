import express from 'express';
import * as product from '../controllers/product.js'; // Pastikan untuk menggunakan .js
import { authenticate, authorizeAdmin } from '../middlewares/middleware.js'; // Pastikan untuk menggunakan .js
import checkId from '../middlewares/checkId.js'; // Pastikan untuk menggunakan .js
import formidable from 'express-formidable';

const router = express.Router();

router.get('/', authenticate, authorizeAdmin, product.FindMany);
router.get('/top', product.fetchTopProducts);
router.get('/new', product.fetchNewProducts);
router.post('/:id/reviews', authenticate, checkId, product.addProductReview);
router.get('/all', authenticate, product.fetchAllProducts);
router.get('/:id', authenticate, authorizeAdmin, product.findOne);
router.post('/', authenticate, authorizeAdmin, formidable(), product.create);
router.put('/:id', authenticate, authorizeAdmin, formidable(), product.update);
router.delete('/:id', authenticate, authorizeAdmin, product.deleteProduct);

export default router;

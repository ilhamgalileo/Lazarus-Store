import Product from '../models/product.js';
import asyncHandler from 'express-async-handler';

export const FindMany = asyncHandler(async (req, res) => {
    try {
        const pageSize = 6;
        const keyword = req.query.keyword
            ? { name: { $regex: req.query.keyword, $options: "i" } }
            : {};
        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword }).limit(pageSize);

        res.json({
            products,
            page: 1,
            pages: Math.ceil(count / pageSize),
            hasMore: false,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "server error" });
    }
});

export const findOne = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const data = await Product.findById(id);

    if (data) {
        res.send(data);
    } else {
        res.status(500).send({ message: 'Product not found with id ' + id });
    }
});

export const fetchTopProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({}).sort({ rating: -1 }).limit(4);
        res.json(products)
    } catch (error) {
        console.error(error)
        res.status(400).json(error.message)
    }
});

export const fetchNewProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find().sort({ _id: -1 }).limit(5);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(400).json(error.message);
    }
});

export const fetchAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({})
            .populate("category")
            .limit(12)
            .sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

export const addProductReview = asyncHandler(async (req, res) => {
    try {
        const { rating, comment } = req.body
        const product = await Product.findById(req.params.id)

        if (product) {
            const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString())
            if (alreadyReviewed) {
                res.status(400)
                throw new Error("Product already reviewed")
            }
            const review = {
                name: req.user.username,
                rating: Number(rating),
                comment,
                user: req.user._id, 
            };
            product.reviews.push(review)
            product.numReviews = product.reviews.length

            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

            await product.save()
            res.status(201).json({ message: "review added" })   
        } else {
            res.status(404)
            throw new Error("product not found")
        }
    } catch (error) {
        console.error(error)
        res.status(400).json(error.message)
    }
});

export const create = asyncHandler(async (req, res) => {
    try {
        const { name, brand, quantity, category, description, price, image } = req.fields;
        if (!name || !brand || !quantity || !category || !description || !price || !image) {
            return res.json({ error: "All fields are required" })
        }

        const product = new Product({ ...req.fields })
        await product.save()
        res.status(201).json({ message: 'Data Berhasil disimpan', product })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server error" })
    }
});

export const update = asyncHandler(async (req, res) => {
    try {
        const { name, brand, quantity, category, description, price, image } = req.fields;
        // if (!name || !brand || !quantity || !category || !description || !price || !image) {
        //     return res.json({ error: "All fields are required" });
        // }

        const product = await Product.findByIdAndUpdate(req.params.id, { ...req.fields }, { new: true })
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        await product.save();
        res.status(201).json({ message: 'Data Berhasil diperbarui', product })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server error" })
    }
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
        return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    res.json({ message: 'Produk berhasil dihapus', deletedProduct });
});
